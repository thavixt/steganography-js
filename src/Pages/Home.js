import React, { Component } from "react";
import FileSaver from "file-saver";
import Noty from "noty";
import LangContext from "../context/LangContext";
import CanvasSection from "../compontens/CanvasSection/CanvasSection";
import TextAreaSection from "../compontens/TextAreaSection/TextAreaSection";
import ProgressBar from "../compontens/ProgressBar/ProgressBar";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "image",
            sourceFileLoaded: false,
            sourceFileName: null,
            processActive: false,
            progress: 0,
        };
        this.decoder = null;
        this.encoder = null;
    }

    sourceFileLoaded(bool, name) {
        this.setState({ sourceFileLoaded: bool, sourceFileName: name });
    }

    changeOutputMode(mode) {
        this.setState({ mode: mode });
    }

    resetCanvas() {
        // @ts-ignore
        document.getElementById("source-input").value = null;
        let canvas = document.getElementById("source-canvas");
        // @ts-ignore
        let ctx = canvas.getContext("2d");
        // @ts-ignore
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // @ts-ignore
        canvas.height = 150;
        // @ts-ignore
        canvas.width = 300;
    }

    onDecoderMessage(e) {
        const t = this.context;

        if (e.data.progressBar) {
            this.setState({ progress: e.data.progressBar });
        }

        if (e.data.error) {
            this.setState({ processActive: false });
            this.setState({ progress: 0 });

            new Noty({
                theme: "nest",
                type: "error",
                layout: "topRight",
                text: t("notification:error_noty", { message: e.data.error }),
                timeout: 5000,
            }).show();
        }

        if (e.data.done) {
            this.setState({ progress: 100 });

            const fileName = this.state.sourceFileName.split(".").shift() + "_stegojs_"
                + (Math.random() * 10000).toFixed();

            if (e.data.type === "text") {
                // Create a textDecoder object:
                let decoder = new TextDecoder("utf-8");
                // Create a view of the buffer:
                let view = new DataView(
                    e.data.result.buffer,
                    0,
                    e.data.result.buffer.byteLength,
                );
                // Decode the view into a text string:
                let string = decoder.decode(view);
                let text = JSON.parse(string);

                // If the text is fairly big, save as a .txt file instead of displaying it
                if (text.length > 1000) {
                    this._resultTextArea.setText(t("notification:text_size_too_big"));
                    const blob = new Blob(text, { type: "text/plain;charset=utf-8" });
                    FileSaver.saveAs(blob, fileName + ".txt");
                } else {
                    let resultText = text.join("");
                    this._resultTextArea.setText(resultText);
                }
            } else if (e.data.type === "image") {
                let typed = new Uint8ClampedArray(e.data.result.buffer);
                let resultImage = new ImageData(
                    typed,
                    e.data.result.width,
                    e.data.result.height,
                );
                // Draw the new image
                this._resultCanvas.updateImage(
                    resultImage,
                    fileName + ".bmp",
                );
                this._resultCanvas.scale("in");
            }

            new Noty({
                theme: "nest",
                type: "success",
                layout: "topRight",
                text: t("notification:decoding_finished", { time: e.data.done }),
                timeout: 5000,
            }).show();

            this.decoder.terminate();
            this.decoder = null;

            setTimeout(() => {
                this.setState({ processActive: false });
                this.setState({ progress: 0 });
            }, 1000);
        }
    }

    decode(params) {
        const t = this.context;

        if (this.state.mode === "image") {
            // Check if the image is at least 4*4 pixels to perform LSB steganography on
            if ((params.image.height < 2) || (params.image.width < 2)) {
                new Noty({
                    theme: "nest",
                    type: "error",
                    layout: "topRight",
                    text: t("notification:source_size_too_small"),
                    timeout: 5000,
                }).show();
                return;
            }
        }

        this.state.mode === "image"
            ? this._resultCanvas.scale("out")
            : this._resultTextArea.resetState();
        this.setState({ processActive: true });
        this.decoder = new Worker(
            `${process.env.PUBLIC_URL}/workers/decoder.worker.js`,
        );

        this.decoder.onmessage = this.onDecoderMessage.bind(this);
        // Pass payload to the decoder worker
        this.decoder.postMessage({
            ...params,
            mode: this.state.mode,
        }, [params.image.buffer]);
    }

    onEncoderMessage(e) {
        const t = this.context;

        if (e.data.progressBar) {
            this.setState({ progress: e.data.progressBar });
        }

        if (e.data.error) {
            this.setState({ processActive: false });
            this.setState({ progress: 0 });

            new Noty({
                theme: "nest",
                type: "error",
                layout: "topRight",
                text: t("notification:error_noty", { message: e.data.error }),
                timeout: 5000,
            }).show();
        }

        if (e.data.done) {
            this.setState({ progress: 100 });

            // Create a random file name
            let fileName = this.state.sourceFileName.split(".").shift() +
                "_stegojs_" + (Math.random() * 10000).toFixed();

            // Create a TypedArray from the transferred ArrayBuffer
            const typed = new Uint8ClampedArray(e.data.result.buffer);
            // Create an ImageData object to draw to the canvas
            const resultImage = new ImageData(
                typed,
                e.data.result.width,
                e.data.result.height,
            );
            this._sourceCanvas.updateImage(
                resultImage, //new ImageData(new Uint8ClampedArray([123, 0, 123, 255]), 1, 1),
                fileName + ".bmp",
            );

            this._sourceCanvas.scale("in");

            new Noty({
                theme: "nest",
                type: "success",
                layout: "topRight",
                text: t("notification:encoding_finished", { time: e.data.done }),
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
        const t = this.context;

        this.setState({ processActive: true });
        let payload, transferList;

        // Get the source image
        let canvas = document.getElementById("source-canvas");
        // @ts-ignore
        let ctx = canvas.getContext("2d");
        // @ts-ignore
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let image = {
            buffer: imageData.data.buffer,
            // @ts-ignore
            width: canvas.width,
            // @ts-ignore
            height: canvas.height,
        };

        // Get payload and perform checks
        if (this.state.mode === "image") {
            // We're trying to store the payload image inside the source image
            if (
                (params.image.height * 2 > image.height) ||
                (params.image.width * 2 > image.width)
            ) {
                if (!window.confirm(t("notification:size_mismatch_confirm"))) {
                    this.setState({ processActive: false });
                    return;
                }
            }
            payload = params.image;
            transferList = [imageData.data.buffer, params.image.buffer];
            this._resultCanvas.resetState();
        } else if (this.state.mode === "text") {
            // We're trying to store the playload text inside the source image
            payload = params.text;
            transferList = [imageData.data.buffer];
            this._resultTextArea.resetState();
        } else {
            window.alert(t("notification:unknown_operation"));
            console.error('Encode process"' + this.state.mode + '" is not recognized.');
            return;
        }

        this._sourceCanvas.scale("out");
        this.setState({ processActive: true });
        this.encoder = new Worker(
            `${process.env.PUBLIC_URL}/workers/encoder.worker.js`,
        );

        this.encoder.onmessage = this.onEncoderMessage.bind(this);
        // Pass payload to the encoder worker
        this.encoder.postMessage({
            image: image,
            payload: payload,
            mode: this.state.mode,
            proces: params.process,
        }, transferList);
    }

    render() {
        const t = this.context;
        return (
            <div>
                <div className="App-content">
                    <div className="output-selector" id="io-selector">
                        <label htmlFor="mode">{t("common:payload")}:</label>
                        <label className="radio-label">
                            <input
                                name="mode"
                                type="radio"
                                onChange={() => this.changeOutputMode("image")}
                                defaultChecked
                            />
                            <span>{t("common:image")}</span>
                        </label>
                        <label className="radio-label">
                            <input
                                name="mode"
                                type="radio"
                                onChange={() => this.changeOutputMode("text")}
                            />
                            <span>{t("common:text")}</span>
                        </label>
                    </div>
                    <ProgressBar
                        active={this.state.processActive}
                        progress={this.state.progress}
                        id="stego-progressbar"
                    />
                    <div id="grid-wrapper">
                        <div className="grid-element" id="source-section">
                            <h5 className="section-title">Source image</h5>
                            <CanvasSection
                                ref={(ref) => this._sourceCanvas = ref}
                                id="source"
                                sourceFileLoaded="true"
                                onFileLoaded={(bool, name) => this.sourceFileLoaded(bool, name)}
                                process={(params) => this.decode(params)}
                                processName="decode"
                                isAProcessActive={this.state.processActive}
                                clear={true}
                                download={true}
                            />
                        </div>
                        <div className="grid-element" id="result-section">
                            <h5 className="section-title">{t("common:payload")}</h5>
                            {this.state.mode === "image"
                                ? (<CanvasSection
                                    ref={(ref) => this._resultCanvas = ref}
                                    id="result"
                                    sourceFileLoaded={this.state.sourceFileLoaded}
                                    onFileLoaded={() => { }}
                                    process={(params) => this.encode(params)}
                                    isAProcessActive={this.state.processActive}
                                    processName="encode"
                                    clear={true}
                                    download={true}
                                />)
                                : (<TextAreaSection
                                    ref={(ref) => this._resultTextArea = ref}
                                    id="result"
                                    clear="true"
                                    sourceFileLoaded={this.state.sourceFileLoaded}
                                    onFileLoaded={() => { }}
                                    process={(params) => this.encode(params)}
                                    isAProcessActive={this.state.processActive}
                                    processName="encode"
                                />)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Home.contextType = LangContext;
