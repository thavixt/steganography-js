import React, { Component } from "react";
import Noty from "noty";
import LangContext from "../context/LangContext";
import CanvasSection from "../compontens/CanvasSection/CanvasSection";
import ColorSelector from "../compontens/ColorSelector/ColorSelector";
import ProgressBar from "../compontens/ProgressBar/ProgressBar";

export default class Comparison extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processActive: false,
      progress: 0,
      firstFile: "",
      secondFile: "",
    };
    this.differ = null;
  }

  firstFileLoaded(bool, name) {
    this.setState({ firstFile: true });
  }

  secondFileLoaded(bool, name) {
    this.setState({ secondFile: true });
  }

  onDifferMessage(e, transferList) {
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

      let fileName = "diff_stegojs_" + (Math.random() * 10000).toFixed();

      // Image mode result
      // Create a TypedArray from the transferred ArrayBuffer
      let typed = new Uint8ClampedArray(e.data.result.buffer);
      // Create an ImageData object to draw to the canvas
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

      new Noty({
        theme: "nest",
        type: "success",
        layout: "topRight",
        text: t("notification:diffing_finished", { time: e.data.done }),
        timeout: 5000,
      }).show();

      // Terminate worker
      this.differ.terminate();
      this.differ = null;

      setTimeout(() => {
        this.setState({ processActive: false, progress: 0 });
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
      second: secondImage,
    };
    const transferList = [firstImage.buffer, secondImage.buffer];

    this._resultCanvas.scale("out");

    this.setState({ processActive: true });
    this.differ = new Worker(
      `${process.env.PUBLIC_URL}/workers/differ.worker.js`,
    );
    // Set handler
    this.differ.onmessage = this.onDifferMessage.bind(this);
    // Start process
    this.differ.postMessage(payload, transferList);
  }

  render() {
    const t = this.context;
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
            <h5 className="section-title">{t("comparison:first_image")}</h5>
            <CanvasSection
              ref={(ref) => this._firstImage = ref}
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
            <h5 className="section-title">{t("comparison:second_image")}</h5>
            <CanvasSection
              ref={(ref) => this._secondImage = ref}
              id="second-image"
              sourceFileLoaded="true"
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
            <h5 className="section-title">{t("comparison:diff_color")}</h5>
            <ColorSelector ref={(ref) => this._colorSelector = ref} />
          </div>

          <div
            className="grid-element"
            id="result-section"
            style={{ gridRow: "1 / span 4", gridColumnStart: 2 }}
          >
            <h5 className="section-title">{t("common:difference")}</h5>
            <CanvasSection
              style={{ width: 2 }}
              ref={(ref) => this._resultCanvas = ref}
              id="result-image"
              disableInput
            />
            <div className="section-actions">
              <button
                className="waves-effect waves-light btn grey darken-4"
                disabled={!this.state.firstFile || !this.state.secondFile ||
                  this.state.processActive}
                onClick={() => this.diff()}
                style={{ margin: "auto" }}
              >
                {t("common:compare")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Comparison.contextType = LangContext;
