import React, { Component } from "react";
import FileSaver from "file-saver";
import LangContext from "../../context/LangContext";

export default class CanvasSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileName: "",
            fileLoaded: false,
            scale: "", // "in" || "out"
        };
    }

    scale(phase) {
        this.setState({ scale: phase });
    }

    handleFileChange(file) {
        let canvas = this._canvas;
        let ctx = canvas.getContext("2d");

        let reader = new FileReader();
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
            img.src = reader.result;
        };

        // Is there a file?
        if (file) {
            reader.readAsDataURL(file);
            this.setState({ fileName: file.name, fileLoaded: true });
            this.props.onFileLoaded(true, file.name);
        } else {
            this.setState({ fileName: "", fileLoaded: false });
            this.props.onFileLoaded(false, null);
            // Reset canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.height = 150;
            canvas.width = 300;
        }
    }

    resetState() {
        this.setState({ fileName: "", fileLoaded: false });
        if (!this.props.disableInput) this._fileInput.value = null;
        // Reset canvas
        let canvas = this._canvas;
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.height = 150;
        canvas.width = 300;
    }

    updateImage(image, fileName) {
        this.setState({ fileName: fileName, fileLoaded: true });
        let canvas = this._canvas;
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.height = image.height;
        canvas.width = image.width;
        ctx.imageSmoothingEnabled = false;
        ctx.putImageData(image, 0, 0);
    }

    downloadCanvas() {
        // Split the file name from the extension
        let fileName = this.state.fileName;
        // Create a random file name
        fileName = "stegojs_" + (Math.random() * 1000000).toFixed() + "_" +
            fileName + ".bmp";
        let canvas = this._canvas;
        canvas.toBlob(function(blob) {
            FileSaver.saveAs(blob, fileName);
        });
    }

    handleProcess() {
        let canvas = this._canvas;
        let ctx = canvas.getContext("2d");
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // Grab the arrayBuffer of the imageData object
        let buffer = imageData.data.buffer;
        this.props.process({
            process: this.props.processName,
            image: {
                buffer: buffer,
                width: canvas.width,
                height: canvas.height,
            },
        });
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
                        ref={(ref) => this._fileInput = ref}
                        onChange={(e) => this.handleFileChange(e.target.files[0])}
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
                        ref={(ref) => this._canvas = ref}
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
