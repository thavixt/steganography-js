import React, { Component } from "react";
import Noty from "noty";

// Components
import CanvasSection from "../Components/CanvasSection/CanvasSection";
import ColorSelector from "../Components/ColorSelector/ColorSelector";
//import Compare from "../Components/Compare/Compare";
import ProgressBar from "../Components/ProgressBar/ProgressBar";

// Web workers
/* eslint-disable */
import differWorker from "worker-loader!../Workers/differ.worker";
/* eslint-enable */

export default class Comparison extends Component {
    constructor(props) {
        super(props);
        this.state = {
            processActive: false,
            progress: 0,
            firstFile: "",
            secondFile: ""
        }
        this.differ = null;
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

    firstFileLoaded(bool, name) {
        this.setState({ firstFile: true });
    }

    secondFileLoaded(bool, name) {
        this.setState({ secondFile: true });
    }

    onDifferMessage(e, transferList) {
        // Progression % data from the worker thread
        if (e.data.progressBar) {
            this.setState({ progress: e.data.progressBar });
        }
        // Error
        if (e.data.error) {
            //console.log(e.data);
            this.setState({ processActive: false });
            this.setState({ progress: 0 });

            // Update stats
            this._progressBar.showStats("Error: " + e.data.error);
            new Noty({
                theme: "semanticui",
                type: "error",
                layout: "topRight",
                text: "Error:<br/>" + e.data.error,
                timeout: 2000,
            }).show();
        }
        // Work finished
        if (e.data.done) {
            this.setState({ progress: 100 });
            //console.log("Decoding finished in " + e.data.done + " milliseconds.");
            //console.log(e.data);

            // Split the file name from the extension
            let fileName = "diff";
            // Create a random file name
            fileName = fileName + "_stegojs_" + (Math.random() * 10000).toFixed();

            // Image mode result
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

            // Log to db
            this.log({
                processTime: e.data.done.toString(),
                function: "diff",
                type: e.data.type,
                result: e.data.result.byteLength.toString(),
                payload: "0"
            });

            // Update stats
            this._progressBar.showStats("Diffing finished in " + e.data.done + " milliseconds.");
            new Noty({
                theme: "semanticui",
                type: "success",
                layout: "topRight",
                text: "Diffing finished in " + e.data.done + " milliseconds.",
                timeout: 5000,
            }).show();

            // Terminate worker
            this.differ.terminate();
            this.differ = null;

            setTimeout(() => {
                this.setState({ processActive: false });
                this.setState({ progress: 0 });
            }, 1000);
        }
    }

    diff() {
        // Clear the previous result
        this._resultCanvas.resetState();

        // Get the first image
        let canvas = document.getElementById("first-image-canvas");
        let ctx = canvas.getContext("2d");
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let firstImage = {
            buffer: imageData.data.buffer,
            width: canvas.width,
            height: canvas.height,
        };
        // Get the second image
        let canvas2 = document.getElementById("second-image-canvas");
        let ctx2 = canvas2.getContext("2d");
        let imageData2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
        let secondImage = {
            buffer: imageData2.data.buffer,
            width: canvas2.width,
            height: canvas2.height,
        };
        // Get the selected highlight color
        const highlight = this._colorSelector.getColor();

        // Merge params
        const payload = {
            process: "diff",
            mode: "DEFAULT", // TODO: create modes
            diffColor: highlight,
            first: firstImage,
            second: secondImage
        };
        const transferList = [firstImage.buffer, secondImage.buffer];

        this._resultCanvas.scale("out");

        // Instantiate a new worker
        this.setState({ processActive: true });
        this.differ = new differWorker();
        // Set handler
        this.differ.onmessage = this.onDifferMessage.bind(this);
        // Start process
        this.differ.postMessage(payload, transferList);
    }

    render() {
        const firstImage = <CanvasSection
            ref={(ref) => this._firstImage = ref}
            id="first-image"
            onFileLoaded={(bool, name) => this.firstFileLoaded(bool, name)}
            isAProcessActive={this.state.processActive}
            test_load="test.png"
            hideCanvas>
        </CanvasSection>

        const secondImage = <CanvasSection
            ref={(ref) => this._secondImage = ref}
            id="second-image"
            sourceFileLoaded="true"
            onFileLoaded={(bool, name) => this.secondFileLoaded(bool, name)}
            isAProcessActive={this.state.processActive}
            test_load="test-altered.bmp"
            hideCanvas>
        </CanvasSection>

        const processButton =
            <button className="waves-effect waves-light btn purple darken-4"
                disabled={!this.state.firstFile || !this.state.secondFile || this.state.processActive}
                onClick={() => this.diff()}
                style={{ margin: "auto" }}>
                Compare
            </button>

        const resultImage = <CanvasSection
            style={{ width: 2 }}
            ref={(ref) => this._resultCanvas = ref}
            id="result-image" disableInput>
        </CanvasSection>

        return (
            <div className="App-content pad-top" >
                {/* <h5 className="section-title">Comparing images</h5> */}
                {/* <p>Do some stuff with your image and compare it with the original! Will anyone notice your hidden message?</p> */}

                <ProgressBar
                    ref={(ref) => this._progressBar = ref}
                    active={this.state.processActive}
                    progress={this.state.progress}>
                </ProgressBar>

                <div id="grid-wrapper-vertical">

                    <div className="grid-element" id="first-section"
                        style={{ gridColumnStart: 1 }}>
                        <h5 className="section-title">First image</h5>
                        {firstImage}
                    </div>
                    <div className="grid-element" id="second-section"
                        style={{ gridColumnStart: 1 }}>
                        <h5 className="section-title">Second image</h5>
                        {secondImage}
                    </div>
                    <div className="grid-element" id="highlight-section"
                        style={{ gridColumnStart: 1 }}>
                        <h5 className="section-title">Highlight color</h5>
                        <ColorSelector ref={(ref) => this._colorSelector = ref} />
                    </div>

                    <div className="grid-element" id="result-section"
                        style={{ gridRow: "1 / span 4", gridColumnStart: 2 }}>
                        <h5 className="section-title">Difference</h5>
                        {resultImage}
                        <div className="section-actions">
                            {processButton}
                        </div>
                    </div>

                    {/* /.grid-wrapper */}
                </div>
            </div >
        );
    }
}
