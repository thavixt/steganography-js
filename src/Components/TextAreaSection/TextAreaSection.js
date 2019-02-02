import React, { Component } from "react";
import './TextAreaSection.css';

class CanvasSection extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    resetState() {
        this._textArea.value = "";
    }

    setText(text) {
        this._textArea.value = text;
    }

    handleProcess() {
        // Get the message string
        let string = JSON.stringify(this._textArea.value);
        let uint8_array = new TextEncoder(/* document.characterSet.toLowerCase() */).encode(string);
        let payload = uint8_array.buffer;
        this.props.process({
            process: this.props.processName,
            text: {
                buffer: payload,
                length: string.length
            }
        })
    }

    render() {
        const disableButtons =
            !this.props.sourceFileLoaded
            || this.props.isAProcessActive;

        return (
            <div>
                <br />
                <div className="section-content input-field">
                    <label className="label"
                        htmlFor={this.props.id + "-text"}>
                        Text I/O *
                    </label>
                    <br /><br />
                    <textarea
                        className="materialize-textarea textarea"
                        id={this.props.id + "-text"}
                        ref={(ref) => this._textArea = ref}>
                    </textarea>
                    <span>* <small>Larger text output will be automatically downloaded as a .txt file. These files can be several MBs in size depending on the source image, so try opening it with a roboust text editor.</small></span>
                </div>
                <div className="section-actions secondary">
                    <button
                        className="waves-effect waves-light btn yellow darken-1 black-text"
                        disabled={this.props.isAProcessActive}
                        onClick={() => this.resetState()}>
                        Clear
                    </button>
                </div>
                <div className="section-actions">
                    <button
                        className="waves-effect waves-light btn purple darken-4"
                        disabled={disableButtons}
                        onClick={() => this.handleProcess()}>
                        {this.props.processName}
                    </button>
                </div>
            </div>
        )
    }
}

export default CanvasSection;
