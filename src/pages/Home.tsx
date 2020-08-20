import React, { Component, createRef } from "react";
import FileSaver from "file-saver";
import Noty from "noty";
import LangContext from "../context/LangContext";
import CanvasSection from "../components/CanvasSection/CanvasSection";
import TextAreaSection from "../components/TextAreaSection/TextAreaSection";
import ProgressBar from "../components/ProgressBar/ProgressBar";

interface State {
    mode: AppMode;
    sourceFileLoaded: boolean;
    sourceFileName: string;
    processActive: boolean;
    progress: number;
}

export default class Home extends Component<{}, State> {
    _sourceCanvas = createRef<CanvasSection>();
    _resultCanvas = createRef<CanvasSection>();
    _resultTextArea = createRef<TextAreaSection>();

    state = {
        mode: "image" as AppMode,
        sourceFileLoaded: false,
        sourceFileName: "",
        processActive: false,
        progress: 0,
    };

    decoder: Worker | null = null;
    encoder: Worker | null = null;

    sourceFileLoaded = (loaded: boolean, fileName: string) => {
        this.setState({ sourceFileLoaded: loaded, sourceFileName: fileName });
    }

    changeOutputMode = (mode: AppMode) => {
        this.setState({ mode });
    }

    resetCanvas = () => {
        const input = document.getElementById("source-input") as HTMLInputElement;
        input.value = "";

        const canvas = document.getElementById("source-canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.height = 150;
        canvas.width = 300;
    }

    onDecoderMessage = (e: MessageEvent) => {
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
                text: this.context("notification:error_noty", { message: e.data.error }),
                timeout: 5000,
            }).show();
        }

        if (e.data.done) {
            this.setState({ progress: 100 });

            const fileName = this.state.sourceFileName.split(".").shift() + "_stegojs_"
                + (Math.random() * 10000).toFixed();

            if (e.data.type === "text") {
                const decoder = new TextDecoder("utf-8");
                // Create a view of the buffer:
                const view = new DataView(
                    e.data.result.buffer,
                    0,
                    e.data.result.buffer.byteLength,
                );
                // Decode the view into a text string:
                const text = JSON.parse(decoder.decode(view));

                // If the text is fairly big, save as a .txt file instead of displaying it
                if (text.length > 1000) {
                    this._resultTextArea.current?.setText(this.context("notification:text_size_too_big"));
                    const blob = new Blob(text, { type: "text/plain;charset=utf-8" });
                    FileSaver.saveAs(blob, fileName + ".txt");
                } else {
                    let resultText = text.join("");
                    this._resultTextArea.current?.setText(resultText);
                }
            } else if (e.data.type === "image") {
                const typed = new Uint8ClampedArray(e.data.result.buffer);
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
            }

            new Noty({
                theme: "nest",
                type: "success",
                layout: "topRight",
                text: this.context("notification:decoding_finished", { time: e.data.done }),
                timeout: 5000,
            }).show();

            if (this.decoder) {
                this.decoder.terminate();
                this.decoder = null;
            }

            setTimeout(() => {
                this.setState({ processActive: false });
                this.setState({ progress: 0 });
            }, 1000);
        }
    }

    decode = (params: { image: ImagePayload }) => {
        if (this.state.mode === "image") {
            // Check if the image is at least 4*4 pixels to perform LSB steganography on
            if ((params.image.height < 2) || (params.image.width < 2)) {
                new Noty({
                    theme: "nest",
                    type: "error",
                    layout: "topRight",
                    text: this.context("notification:source_size_too_small"),
                    timeout: 5000,
                }).show();
                return;
            }
        }

        if (this.state.mode === "image") {
            this._resultCanvas.current?.scale("out");
        } else {
            this._resultTextArea.current?.resetState();
        }

        this.setState({ processActive: true });
        this.decoder = new Worker(
            `${process.env.PUBLIC_URL}/workers/decoder.worker.js`,
        );

        this.decoder.onmessage = this.onDecoderMessage;
        // Pass payload to the decoder worker
        this.decoder.postMessage({
            ...params,
            mode: this.state.mode,
        }, [params.image.buffer]);
    }

    onEncoderMessage = (e: MessageEvent) => {
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
                text: this.context("notification:error_noty", { message: e.data.error }),
                timeout: 5000,
            }).show();
        }

        if (e.data.done) {
            this.setState({ progress: 100 });

            // Create a random file name
            const fileName = this.state.sourceFileName.split(".").shift() +
                "_stegojs_" + (Math.random() * 10000).toFixed();
            // Create a TypedArray from the transferred ArrayBuffer
            const typed = new Uint8ClampedArray(e.data.result.buffer);
            // Create an ImageData object to draw to the canvas
            const resultImage = new ImageData(
                typed,
                e.data.result.width,
                e.data.result.height,
            );

            this._sourceCanvas.current?.updateImage(
                resultImage, //new ImageData(new Uint8ClampedArray([123, 0, 123, 255]), 1, 1),
                fileName + ".bmp",
            );
            this._sourceCanvas.current?.scale("in");

            new Noty({
                theme: "nest",
                type: "success",
                layout: "topRight",
                text: this.context("notification:encoding_finished", { time: e.data.done }),
                timeout: 5000,
            }).show();

            if (this.encoder) {
                this.encoder.terminate();
                this.encoder = null;
            }

            setTimeout(() => {
                this.setState({ processActive: false });
                this.setState({ progress: 0 });
            }, 1000);
        }
    }

    encode = (params: { process: ProcessType, image?: ImagePayload, text?: TextPayload }) => {
        this.setState({ processActive: true });
        let payload, transferList;

        // Get the source image
        const canvas = document.getElementById("source-canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d")!;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const image = {
            buffer: imageData.data.buffer,
            width: canvas.width,
            height: canvas.height,
        };

        // Get payload and perform checks
        if (this.state.mode === "image" && params.image) {
            // We're trying to store the payload image inside the source image
            if (
                (params.image.height * 2 > image.height) ||
                (params.image.width * 2 > image.width)
            ) {
                if (!window.confirm(this.context("notification:size_mismatch_confirm"))) {
                    this.setState({ processActive: false });
                    return;
                }
            }
            payload = params.image;
            transferList = [imageData.data.buffer, params.image.buffer];
            this._resultCanvas.current?.resetState();
        } else if (this.state.mode === "text" && params.text) {
            // We're trying to store the playload text inside the source image
            payload = params.text;
            transferList = [imageData.data.buffer];
            this._resultTextArea.current?.resetState();
        } else {
            window.alert(this.context("notification:unknown_operation"));
            console.error('Encode process "' + this.state.mode + '" is not recognized.');
            return;
        }

        this._sourceCanvas.current?.scale("out");
        this.setState({ processActive: true });
        this.encoder = new Worker(`${process.env.PUBLIC_URL}/workers/encoder.worker.js`);

        this.encoder.onmessage = this.onEncoderMessage;
        this.encoder.postMessage({
            image: image,
            payload: payload,
            mode: this.state.mode,
            proces: params.process,
        }, transferList);
    }

    render() {
        return (
            <div>
                <div className="App-content">
                    <div className="output-selector" id="io-selector">
                        <label htmlFor="mode">{this.context("common:payload")}:</label>
                        <label className="radio-label">
                            <input
                                name="mode"
                                type="radio"
                                onChange={() => this.changeOutputMode("image")}
                                defaultChecked
                            />
                            <span>{this.context("common:image")}</span>
                        </label>
                        <label className="radio-label">
                            <input
                                name="mode"
                                type="radio"
                                onChange={() => this.changeOutputMode("text")}
                            />
                            <span>{this.context("common:text")}</span>
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
                                ref={this._sourceCanvas}
                                id="source"
                                sourceFileLoaded={true}
                                onFileLoaded={(bool, name) => this.sourceFileLoaded(bool, name)}
                                process={(params) => this.decode(params)}
                                processName="decode"
                                isAProcessActive={this.state.processActive}
                                clear={true}
                                download={true}
                            />
                        </div>
                        <div className="grid-element" id="result-section">
                            <h5 className="section-title">{this.context("common:payload")}</h5>
                            {this.state.mode === "image"
                                ? (<CanvasSection
                                    ref={this._resultCanvas}
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
                                    ref={this._resultTextArea}
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
