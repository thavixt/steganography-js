import React, { Component, createRef } from "react";
import LangContext from "../../context/LangContext";
import "./TextAreaSection.scss";

interface Props {
    clear?: any;
    id?: string;
    isAProcessActive?: boolean;
    sourceFileLoaded?: boolean;
    processName?: ProcessType;
    onFileLoaded?(bool: boolean, fileName: string): void;
    process?(args: { process: string, text: TextPayload }): void;
}

export default class TextAreaSection extends Component<Props> {
    _textArea = createRef<HTMLTextAreaElement>();

    resetState = () => {
        if (this._textArea.current) {
            this._textArea.current.value = "";
        }
    }

    setText = (text: string) => {
        if (this._textArea.current) {
            this._textArea.current.value = text;
        }
    }

    handleProcess = () => {
        const string = JSON.stringify(this._textArea.current?.value);
        const uint8_array = new TextEncoder().encode(string);
        const payload = uint8_array.buffer;

        if (this.props.process && this.props.processName) {
            this.props.process({
                process: this.props.processName,
                text: {
                    buffer: payload,
                    length: string.length,
                },
            });
        }
    }

    render() {
        const t = this.context;
        const disableButtons = !this.props.sourceFileLoaded ||
            this.props.isAProcessActive;

        return (
            <div className="TextAreaSelection">
                <div className="section-content input-field">
                    <label className="label" htmlFor={this.props.id + "-text"}>
                        {t("text_input:label")} *
                    </label>
                    <br />
                    <br />
                    <textarea
                        className="materialize-textarea textarea"
                        id={this.props.id + "-text"}
                        ref={this._textArea}
                    >
                    </textarea>
                    <span>
                        * <small>{t("text_input:large_file_info")}</small>
                    </span>
                </div>
                <div className="section-actions secondary">
                    <button
                        className="waves-effect waves-light btn pink darken-1 black-text"
                        disabled={this.props.isAProcessActive}
                        onClick={() => this.resetState()}
                    >
                        {t("common:clear")}
                    </button>
                </div>
                <div className="section-actions">
                    <button
                        className="waves-effect waves-light btn grey darken-4"
                        disabled={disableButtons}
                        onClick={() => this.handleProcess()}
                    >
                        {this.props.processName}
                    </button>
                </div>
            </div>
        );
    }
}

TextAreaSection.contextType = LangContext;
