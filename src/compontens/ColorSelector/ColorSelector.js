import React, { Component } from "react";
import LangContext from "../../context/LangContext";
import "./ColorSelector.css";

export default class ColorSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      r: 101,
      g: 31,
      b: 255,
      a: 255,
    };
  }

  getColor() {
    return {
      r: this.state.r,
      g: this.state.g,
      b: this.state.b,
      a: this.state.a,
    };
  }

  setColor({ r, g, b, a = 255 }) {
    this.setState({ r, g, b });
  }

  selectColor(hexColor) {
    let { r, g, b } = this.hexToRgb(hexColor);
    this.setState({ r, g, b });
  }

  hexToRgb(hexColor) {
    let hex = hexColor.split("#").pop();
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return { r, g, b };
  }

  rgbToHex(r, g, b) {
    function componentToHex(c) {
      let hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }
    let hex = "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    return hex;
  }

  render() {
    const t = this.context;

    return (
      <div className="color-selector">
        {t("color_selector:select_color")}:
        <input
          type="color"
          onChange={(e) => this.selectColor(e.target.value)}
          defaultValue={this.rgbToHex(this.state.r, this.state.g, this.state.b)}
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
