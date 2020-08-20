import React, { Component } from "react";
import LangContext from "../../context/LangContext";
import "./ColorSelector.scss";

interface State {
    r: number;
    g: number;
    b: number;
    a: number;
}

export default class ColorSelector extends Component<{}, State> {
    state = {
        r: 101,
        g: 31,
        b: 255,
        a: 255,
    };

    getColor = () => this.state;

    setColor = ({ r, g, b }: { r: number, g: number, b: number }) => {
        this.setState({ r, g, b });
    }

    selectColor = (hexColor: string) => {
        this.setState({ ...hexToRgb(hexColor) });
    }

    render() {
        return (
            <div className="color-selector">
                {this.context("color_selector:select_color")}:
                <input
                    type="color"
                    onChange={(e) => this.selectColor(e.target.value)}
                    defaultValue={rgbToHex(this.state.r, this.state.g, this.state.b)}
                />
                <span
                    className="color-selector-preview"
                    style={{
                        backgroundColor: `rgba(${Object.values(this.state).join(",")})`,
                    }}
                >
                </span>
            </div>
        );
    }
}

ColorSelector.contextType = LangContext;

const hexToRgb = (hexColor: string) => {
    const hex = hexColor.split("#").pop()!;
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

const rgbToHex = (r: number, g: number, b: number) => {
    const hex = "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    return hex;
}

const componentToHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}
