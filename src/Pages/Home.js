import React, { Component } from "react";
import FileSaver from "file-saver";

// Noty.js
import Noty from "noty";
import 'noty/lib/noty.css';
import 'noty/lib/themes/semanticui.css';

// Components
import CanvasSection from "../Components/CanvasSection/CanvasSection";
import TextAreaSection from "../Components/TextAreaSection/TextAreaSection";
import ProgressBar from "../Components/ProgressBar/ProgressBar";

// Web workers
/* eslint-disable */
import decoderWorker from "worker-loader!../Workers/decoder.worker";
import encodeWorker from "worker-loader!../Workers/encoder.worker";
/* eslint-enable */
/* const decoder = new decoderWorker();
const encoder = new encodeWorker(); */

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "image",
            sourceFileLoaded: false,
            sourceFileName: null,
            processActive: false,
            progress: 0
        };
        this.decoder = null;
        this.encoder = null;
    }

    log(params) {
        //console.log("LOG PARAMS: ", params); return false;
        fetch('https://ruf7yqfxpj.execute-api.eu-central-1.amazonaws.com/prod/stego-dynamoDB-putItem', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            //mode: 'no-cors', // FIXME: disable in prod
            body: JSON.stringify(params)
        }).then(function (response) {
            //console.log(response)
            return response.json()
        }).then(function (data) {
            //console.info("LOG: ", params, data)
        }).catch(function (res) { console.log(res) })
    }

    sourceFileLoaded(bool, name) {
        this.setState({ sourceFileLoaded: bool, sourceFileName: name })
    }

    changeOutputMode(mode) {
        this.setState({ mode: mode });
    }

    resetCanvas() {
        document.getElementById("source-input").value = null;
        // Reset canvas
        let canvas = document.getElementById("source-canvas");
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.height = 150;
        canvas.width = 300;
    }

    onDecoderMessage(e, transferList) {
        // Progression % data from the worker thread
        if (e.data.progressBar) {
            this.setState({ progress: e.data.progressBar });
        }
        // Error
        if (e.data.error) {
            console.log(e.data);
            this.setState({ processActive: false });
            this.setState({ progress: 0 });

            // Update stats
            this._progressBar.showStats("Error: " + e.data.error);
            new Noty({
                theme: "semanticui",
                type: "error",
                layout: "topRight",
                text: "Error:<br/>" + e.data.error,
                timeout: 5000,
            }).show();
        }
        // Work finished
        if (e.data.done) {
            this.setState({ progress: 100 });
            //console.log("Decoding finished in " + e.data.done + " milliseconds.");
            //console.log(e.data);

            // Split the file name from the extension
            let fileName = this.state.sourceFileName.split(".").shift();
            // Create a random file name
            fileName = fileName + "_stegojs_" + (Math.random() * 10000).toFixed();

            // Text mode result
            if (e.data.type === "text") {
                // Decode the transferred arrayBuffer in e.data.buffer
                // Create a textDecoder object:
                let decoder = new TextDecoder("utf-8");
                // Create a view of the buffer:
                let view = new DataView(e.data.result.buffer, 0, e.data.result.buffer.byteLength);
                // Decode the view into a text string:
                let string = decoder.decode(view);
                // Parse the decoded text into a JSON object
                let text = JSON.parse(string);

                // If the text is fairly big, save as a .txt file instead of displaying it
                if (text.length > 1000) {
                    // Using Filesaver.js
                    var blob = new Blob(text, { type: "text/plain;charset=utf-8" });
                    FileSaver.saveAs(blob, fileName + ".txt");
                    this._resultTextArea.setText("The decoded text has been downloaded.\nPlease be aware that this file might be several MBs in size, and may briefly freeze your text editor when opened.\n\nIf you wish to hide some text into your image:\n\t- 'Clear' this text area\n\t- type your message here\n\t- and click 'Encode'.");
                } else {
                    let resultText = text.join("");
                    this._resultTextArea.setText(resultText);
                }
            }
            // Image mode result
            else if (e.data.type === "image") {
                // Create a TypedArray from the transferred ArrayBuffer
                let typed = new Uint8ClampedArray(e.data.result.buffer);
                // Create an ImageData object to draw to the canvas
                let resultImage = new ImageData(typed, e.data.result.width, e.data.result.height);
                //console.log(resultImage);
                // Draw the new image
                this._resultCanvas.updateImage(
                    resultImage,
                    fileName + ".bmp"
                );
                this._resultCanvas.scale("in");
            }

            // Log to db
            this.log({
                processTime: e.data.done.toString(),
                function: "decode",
                type: e.data.type,
                result: e.data.result.byteLength.toString(),
                payload: e.data.payload.byteLength.toString(),
            });

            // Update stats
            this._progressBar.showStats("Decoding finished in " + e.data.done + " milliseconds.");
            new Noty({
                theme: "semanticui",
                type: "success",
                layout: "topRight",
                text: "Decoding finished in " + e.data.done + " milliseconds.",
                timeout: 5000,
            }).show();

            // Terminate worker
            this.decoder.terminate();
            this.decoder = null;

            setTimeout(() => {
                this.setState({ processActive: false });
                this.setState({ progress: 0 });
            }, 1000);
        }
    }

    decode(params) {
        //console.clear();
        // Perform checks
        if (this.state.mode === "image") {
            // Check if the image is at least 4*4 pixels to perform LSB steganography on
            if ((params.image.height < 2) || (params.image.width < 2)) {
                new Noty({
                    theme: "semanticui",
                    type: "error",
                    layout: "topRight",
                    text: "The source image must be at least 4*4 pixels in size.",
                    timeout: 5000,
                }).show();
                return false;
            }
        };
        // Reset component - clear canvas or textArea
        //this.state.mode === "image" ? this._resultCanvas.resetState() : this._resultTextArea.resetState();
        this.state.mode === "image" ? this._resultCanvas.scale("out") : this._resultTextArea.resetState();
        this.setState({ processActive: true });
        // Instantiate a new decoder
        this.decoder = new decoderWorker();
        // Set worker message handler
        this.decoder.onmessage = this.onDecoderMessage.bind(this);
        // Pass payload to the decoder worker
        this.decoder.postMessage({
            ...params,
            mode: this.state.mode
        }, [params.image.buffer])
    }

    onEncoderMessage(e, transferList) {
        // Progression % data from the worker thread
        if (e.data.progressBar) {
            this.setState({ progress: e.data.progressBar });
        }
        // Error
        if (e.data.error) {
            console.log(e.data);
            this.setState({ processActive: false });
            this.setState({ progress: 0 });

            // Update stats
            this._progressBar.showStats("Error: " + e.data.error);
            new Noty({
                theme: "semanticui",
                type: "error",
                layout: "topRight",
                text: "Error:<br/>" + e.data.error,
                timeout: 5000,
            }).show();
        }
        // Work finished
        if (e.data.done) {
            this.setState({ progress: 100 });
            //console.log("Encoding finished in " + e.data.done + " milliseconds.");
            //console.log(e.data);

            // Split the file name from the extension
            let fileName = this.state.sourceFileName.split(".").shift();
            // Create a random file name
            fileName = fileName + "_stegojs_" + (Math.random() * 10000).toFixed();

            // Create a TypedArray from the transferred ArrayBuffer
            let typed = new Uint8ClampedArray(e.data.result.buffer);
            // Create an ImageData object to draw to the canvas
            let resultImage = new ImageData(typed, e.data.result.width, e.data.result.height);

            // Draw the new image
            this._sourceCanvas.updateImage(
                resultImage,
                //new ImageData(new Uint8ClampedArray([123, 0, 123, 255]), 1, 1),
                fileName + ".bmp"
            );

            this._sourceCanvas.scale("in");

            // Log to db
            this.log({
                processTime: e.data.done.toString(),
                function: "encode",
                type: e.data.type,
                result: e.data.result.byteLength.toString(),
                payload: e.data.payload.byteLength.toString(),
            });

            // Update stats
            this._progressBar.showStats("Encoding finished in " + e.data.done + " milliseconds.");
            new Noty({
                theme: "semanticui",
                type: "success",
                layout: "topRight",
                text: "Encoding finished in " + e.data.done + " milliseconds.",
                timeout: 5000,
            }).show();

            // Terminate worker
            this.encoder.terminate();
            this.encoder = null;

            setTimeout(() => {
                this.setState({ processActive: false });
                this.setState({ progress: 0 });
            }, 1000);
        }
    }

    encode(params) {
        //console.clear();
        this.setState({ processActive: true });
        // Reset canvas
        //this.resetCanvas();
        //this._sourceCanvas.resetState();
        let payload, transferList;
        // Get the source image
        let canvas = document.getElementById("source-canvas");
        let ctx = canvas.getContext("2d");
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let image = {
            buffer: imageData.data.buffer,
            width: canvas.width,
            height: canvas.height,
        };
        // Get payload and perform checks
        if (this.state.mode === "image") {
            // We're trying to store the payload image inside the source image
            if ((params.image.height * 2 > image.height) || (params.image.width * 2 > image.width)) {
                if (!window.confirm("The payload image will not fit into the source image.\nContinue anyway?")) {
                    this.setState({ processActive: false });
                    return false;
                }
            }
            payload = params.image;
            transferList = [imageData.data.buffer, params.image.buffer];
            this._resultCanvas.resetState();
        }
        else if (this.state.mode === "text") {
            // We're trying to store the playload text inside the source image
            payload = params.text;
            transferList = [imageData.data.buffer];
            this._resultTextArea.resetState();
        }
        else {
            window.alert("Unknown operation - check the console for details.");
            console.error("Encode process\"" + this.state.mode + "\" is not recognized.");
            return false;
        }

        this._sourceCanvas.scale("out");

        this.setState({ processActive: true });
        // Instantiate a new decoder
        this.encoder = new encodeWorker();
        // Set worker message handler
        this.encoder.onmessage = this.onEncoderMessage.bind(this);
        // Pass payload to the encoder worker
        this.encoder.postMessage({
            image: image,
            payload: payload,
            mode: this.state.mode,
            proces: params.process,
        }, transferList)
    }

    render() {
        const activeProgressBar = <ProgressBar
            ref={(ref) => this._progressBar = ref}
            active={this.state.processActive}
            progress={this.state.progress}
            id="stego-progressbar">
        </ProgressBar>

        const sourceCanvasSection = <CanvasSection
            ref={(ref) => this._sourceCanvas = ref}
            id="source"
            sourceFileLoaded="true"
            onFileLoaded={(bool, name) => this.sourceFileLoaded(bool, name)}
            process={(params) => this.decode(params)}
            processName="decode"
            isAProcessActive={this.state.processActive}
            clear={true} download={true}
            test_load="sunset.png"
            test_run="true">
        </CanvasSection>

        const resultCanvasSection = <CanvasSection
            ref={(ref) => this._resultCanvas = ref}
            id="result"
            sourceFileLoaded={this.state.sourceFileLoaded}
            onFileLoaded={() => { }}
            process={(params) => this.encode(params)}
            isAProcessActive={this.state.processActive}
            processName="encode"
            clear={true} download={true}>
        </CanvasSection>;

        const resultTextSection = <TextAreaSection
            ref={(ref) => this._resultTextArea = ref}
            id="result" clear="true"
            sourceFileLoaded={this.state.sourceFileLoaded}
            onFileLoaded={() => { }}
            process={(params) => this.encode(params)}
            isAProcessActive={this.state.processActive}
            processName="encode">
        </TextAreaSection>

        return (
            <div>
                <div className="App-content">

                    <div className="output-selector" id="io-selector">
                        <label htmlFor="mode">Mode:</label>
                        <label className="radio-label">
                            <input name="mode" type="radio"
                                onChange={() => this.changeOutputMode("image")} defaultChecked />
                            <span>Image</span>
                        </label>
                        <label className="radio-label">
                            <input name="mode" type="radio"
                                onChange={() => this.changeOutputMode("text")} />
                            <span>Text</span>
                        </label>
                    </div>

                    {activeProgressBar}

                    <div id="grid-wrapper">
                        <div className="grid-element" id="source-section">
                            <h5 className="section-title">Source image</h5>
                            {sourceCanvasSection}
                        </div>

                        <div className="grid-element" id="result-section">
                            <h5 className="section-title">Input / output</h5>
                            {this.state.mode === "image" ? resultCanvasSection : resultTextSection}
                        </div>
                        {/* /.grid-wrapper */}
                    </div>
                    {/* /.App-content */}
                </div>
                {/* /.App */}
            </div >
        );
    }
}

/**
 * Create an inlined Web Worker from an exported function 
 * TODO: fix jsDoc params
 * @param {{}} module 
 * @returns {WebWorker?}
 */
/* function createInlinedWebWorkerFromModule(module) {
    // Stringify the module's exported function
    let code = decoderWorker.toString();
    // Strip off everything outside the curly braces, only the function body remains
    let functionBody = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));
    // Create an inlined blod of the function body
    let blob = new Blob([functionBody], { type: "application/javascript" });
    // Instantiate a Web Worker
    let inlinedWorker = new Worker(URL.createObjectURL(blob));
    // return the reference to it
    return inlinedWorker;
} */

/* 
// Inline web workers from modules
import decoderWorker from "./Workers/decoder-worker.module";
import encodeWorker from "./Workers/decoder-worker.module";
var code, blob;
// Create decoder inline
code = decoderWorker.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));
blob = new Blob([code], { type: "application/javascript" });
const decoder = new Worker(URL.createObjectURL(blob));
// Create encoder inline
code = encodeWorker.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));
blob = new Blob([code], { type: "application/javascript" });
const encoder = new Worker(URL.createObjectURL(blob));
 */
