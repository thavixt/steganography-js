import React, { Component } from "react";
import "./ProgressBar.css";

export default class ProgressBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      stats: "",
    };
  }

  showStats(text) {
    this.setState({ stats: text });
  }

  render() {
    let description;
    if (this.props.progress > 0) {
      description = <span>
        {this.props.progress} %{/*  - {this.state.message} */}
      </span>;
    } else {
      description = this.state.stats ||
        "Usage with high-res images may result in decreased performance.";
    }

    return (
      <div className="App-progress" id={this.props.id || ""}>
        <div className="progress-indicator-wrapper">
          <div
            className={"grey darken-4 progress-indicator " +
              (this.props.active ? "active" : "")}
            style={{ width: this.props.progress + "%" }}
          >
          </div>
        </div>
        <label
          className={"progress-description " +
            (this.props.active ? "active" : "")}
        >
          {description}
        </label>
      </div>
    );
  }
}
