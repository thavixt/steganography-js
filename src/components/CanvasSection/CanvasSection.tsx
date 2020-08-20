import React, { Component, createRef } from "react";
import FileSaver from "file-saver";
import LangContext from "../../context/LangContext";

type ScalePhase = "in" | "out" | "initial";

interface Props {
    clear?: boolean;
    disableInput?: boolean;
    download?: any;
    hideCanvas?: boolean;
    id?: string;
    isAProcessActive?: boolean;
    sourceFileLoaded?: boolean;
    processName?: ProcessType;
    onFileLoaded?(bool: boolean, fileName: string): void;
    process?(args: { process: string, image: ImagePayload }): void;
}

interface State {
    fileName: string;
    fileLoaded: boolean;
    scale: ScalePhase;
}

export default class CanvasSection extends Component<Props, State> {
    _canvas = createRef<HTMLCanvasElement>();
    _fileInput = createRef<HTMLInputElement>();

    state = {
        fileName: "",
        fileLoaded: false,
        scale: "initial" as ScalePhase,
    };

    scale = (phase: ScalePhase) => {
        this.setState({ scale: phase });
    }

    handleFileChange = (file?: File) => {
        const canvas = this._canvas.current!;
        const ctx = canvas.getContext("2d")!;

        // Is there a file?
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // Create a new image from the input file
                let img = new Image();
                img.onload = () => {
                    canvas.height = img.height;
                    canvas.width = img.width;
                    ctx.imageSmoothingEnabled = false;
                    ctx.drawImage(img, 0, 0);
                };
                img.src = reader.result as string;
            };
            reader.readAsDataURL(file);

            this.setState({ fileName: file.name, fileLoaded: true });
            this.props.onFileLoaded?.(true, file.name);
        } else {
            this.setState({ fileName: "", fileLoaded: false });
            this.props.onFileLoaded?.(false, "");
            // Reset canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.height = 150;
            canvas.width = 300;
        }
    }

    resetState = () => {
        this.setState({ fileName: "", fileLoaded: false });
        if (!this.props.disableInput && this._fileInput.current) {
            this._fileInput.current.value = "";
        }
        // Reset canvas
        const canvas = this._canvas.current!;
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.height = 150;
        canvas.width = 300;
    }

    updateImage = (image: ImageData, fileName: string) => {
        this.setState({ fileName: fileName, fileLoaded: true });

        const canvas = this._canvas.current!;
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.height = image.height;
        canvas.width = image.width;
        ctx.imageSmoothingEnabled = false;
        ctx.putImageData(image, 0, 0);
    }

    downloadCanvas = () => {
        // Create a random file name
        const fileName = "stegojs_" + (Math.random() * 1000000).toFixed() + "_" +
            this.state.fileName + ".bmp";
        const canvas = this._canvas.current!;
        canvas.toBlob(function (blob) {
            if (blob) {
                FileSaver.saveAs(blob, fileName);
            }
        });
    }

    handleProcess = () => {
        const canvas = this._canvas.current!;
        const ctx = canvas.getContext("2d")!;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // Grab the arrayBuffer of the imageData object
        const buffer = imageData.data.buffer;

        if (this.props.process && this.props.processName) {
            this.props.process({
                process: this.props.processName,
                image: {
                    buffer: buffer,
                    width: canvas.width,
                    height: canvas.height,
                },
            });
        }
    }

    render() {
        const t = this.context;

        const disableSecondaryButtons = !this.props.clear ||
            !this.state.fileLoaded ||
            this.props.isAProcessActive;
        const disablePrimaryButton = !this.props.sourceFileLoaded ||
            !this.state.fileLoaded ||
            this.props.isAProcessActive;

        return (
            <div className="CanvasSelection">
                {!this.props.disableInput && <div>
                    <label className="label" htmlFor={this.props.id + "-input"}>
                        {t("image_input:select_file")}
                    </label>
                    <br />
                    <input
                        type="file"
                        id={this.props.id + "-input"}
                        ref={this._fileInput}
                        onChange={(e) => this.handleFileChange(e.target.files?.[0])}
                    />
                </div>}
                <br />

                <div
                    hidden={this.props.hideCanvas}
                    className={"section-content scale-transition scale-" +
                        this.state.scale}
                >
                    <label className="label" htmlFor={this.props.id + "-canvas"}>
                        {this.state.fileName || "Image"}
                    </label>
                    <canvas
                        id={this.props.id + "-canvas"}
                        ref={this._canvas}
                    >
                    </canvas>
                </div>

                <div className="section-actions secondary">
                    {this.props.clear &&
                        <button
                            className="waves-effect waves-light btn pink darken-1 black-text"
                            disabled={disableSecondaryButtons}
                            onClick={() => this.resetState()}
                        >
                            {t("common:clear")}
                        </button>}
                    {this.props.download &&
                        <button
                            className="waves-effect waves-light btn pink darken-1 black-text"
                            disabled={disableSecondaryButtons}
                            onClick={() => this.downloadCanvas()}
                        >
                            {t("common:download")}
                        </button>}
                </div>

                <div className="section-actions">
                    {this.props.process &&
                        <button
                            className="waves-effect waves-light btn grey darken-4"
                            disabled={disablePrimaryButton}
                            onClick={() => this.handleProcess()}
                        >
                            {(this.props.processName === "encode")
                                ? (<i className="material-icons left"></i>)
                                : (<i className="material-icons right"></i>)}
                            {this.props.processName}
                        </button>}
                </div>
            </div>
        );
    }
}

CanvasSection.contextType = LangContext;
