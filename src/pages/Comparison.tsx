import React, { Component, createRef } from "react";
import Noty from "noty";
import LangContext from "../context/LangContext";
import CanvasSection from "../components/CanvasSection/CanvasSection";
import ColorSelector from "../components/ColorSelector/ColorSelector";
import ProgressBar from "../components/ProgressBar/ProgressBar";

interface State {
    processActive: boolean,
    progress: number,
    firstFile: boolean,
    secondFile: boolean,
}

export default class Comparison extends Component<{}, State> {
    _resultCanvas = createRef<CanvasSection>();
    _colorSelector = createRef<ColorSelector>();
    _firstImage = createRef<CanvasSection>();
    _secondImage = createRef<CanvasSection>();

    state = {
        processActive: false,
        progress: 0,
        firstFile: false,
        secondFile: false,
    };

    differ: Worker | null = null;

    firstFileLoaded = (bool: boolean, name: string) => {
        this.setState({ firstFile: bool });
    }

    secondFileLoaded = (bool: boolean, name: string) => {
        this.setState({ secondFile: bool });
    }

    onDifferMessage = (e: MessageEvent) => {
        const t = this.context;

        if (e.data.progressBar) {
            this.setState({ progress: e.data.progressBar });
        }

        if (e.data.error) {
            this.setState({ processActive: false, progress: 0 });

            new Noty({
                theme: "nest",
                type: "error",
                layout: "topRight",
                text: t("notification:error_noty", { message: e.data.error }),
                timeout: 2000,
            }).show();
        }

        if (e.data.done) {
            this.setState({ progress: 100 });

            const fileName = "diff_stegojs_" + (Math.random() * 10000).toFixed();

            // Image mode result
            // Create a TypedArray from the transferred ArrayBuffer
            const typed = new Uint8ClampedArray(e.data.result.buffer);
            // Create an ImageData object to draw to the canvas
            const resultImage = new ImageData(
                typed,
                e.data.result.width,
                e.data.result.height,
            );
            // Draw the new image
            this._resultCanvas.current?.updateImage(
                resultImage,
                fileName + ".bmp",
            );
            this._resultCanvas.current?.scale("in");

            new Noty({
                theme: "nest",
                type: "success",
                layout: "topRight",
                text: t("notification:diffing_finished", { time: e.data.done }),
                timeout: 5000,
            }).show();

            if (this.differ) {
                this.differ.terminate();
                this.differ = null;
            }

            setTimeout(() => {
                this.setState({ processActive: false, progress: 0 });
            }, 1000);
        }
    }

    diff = () => {
        this._resultCanvas.current?.resetState();

        // Get the first image
        const canvas = document.getElementById("first-image-canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d")!;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const firstImage: ImagePayload = {
            buffer: imageData.data.buffer,
            width: canvas.width,
            height: canvas.height,
        };

        // Get the second image
        const canvas2 = document.getElementById("second-image-canvas") as HTMLCanvasElement;
        const ctx2 = canvas2.getContext("2d")!;
        const imageData2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
        const secondImage: ImagePayload = {
            buffer: imageData2.data.buffer,
            width: canvas2.width,
            height: canvas2.height,
        };

        // Merge params
        const payload = {
            process: "diff",
            mode: "image",
            diffColor: this._colorSelector.current?.getColor(),
            first: firstImage,
            second: secondImage,
        };
        const transferList = [firstImage.buffer, secondImage.buffer];

        this._resultCanvas.current?.scale("out");

        this.setState({ processActive: true });
        this.differ = new Worker(`${process.env.PUBLIC_URL}/workers/differ.worker.js`);
        this.differ.onmessage = this.onDifferMessage;
        this.differ.postMessage(payload, transferList);
    }

    render() {
        return (
            <div className="App-content pad-top">
                <ProgressBar
                    active={this.state.processActive}
                    progress={this.state.progress}
                />
                <div id="grid-wrapper-vertical">
                    <div
                        className="grid-element"
                        id="first-section"
                        style={{ gridColumnStart: 1 }}
                    >
                        <h5 className="section-title">{this.context("comparison:first_image")}</h5>
                        <CanvasSection
                            ref={this._firstImage}
                            id="first-image"
                            onFileLoaded={(bool, name) => this.firstFileLoaded(bool, name)}
                            isAProcessActive={this.state.processActive}
                            hideCanvas
                        />
                    </div>
                    <div
                        className="grid-element"
                        id="second-section"
                        style={{ gridColumnStart: 1 }}
                    >
                        <h5 className="section-title">{this.context("comparison:second_image")}</h5>
                        <CanvasSection
                            ref={this._secondImage}
                            id="second-image"
                            sourceFileLoaded={true}
                            onFileLoaded={(bool, name) => this.secondFileLoaded(bool, name)}
                            isAProcessActive={this.state.processActive}
                            hideCanvas
                        />
                    </div>
                    <div
                        className="grid-element"
                        id="highlight-section"
                        style={{ gridColumnStart: 1 }}
                    >
                        <h5 className="section-title">{this.context("comparison:diff_color")}</h5>
                        <ColorSelector ref={this._colorSelector} />
                    </div>

                    <div
                        className="grid-element"
                        id="result-section"
                        style={{ gridRow: "1 / span 4", gridColumnStart: 2 }}
                    >
                        <h5 className="section-title">{this.context("common:difference")}</h5>
                        <CanvasSection
                            ref={this._resultCanvas}
                            id="result-image"
                            disableInput
                        />
                        <div className="section-actions">
                            <button
                                className="waves-effect waves-light btn grey darken-4"
                                disabled={!this.state.firstFile || !this.state.secondFile ||
                                    this.state.processActive}
                                onClick={this.diff}
                                style={{ margin: "auto" }}
                            >
                                {this.context("common:compare")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Comparison.contextType = LangContext;
