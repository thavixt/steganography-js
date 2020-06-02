import React from "react";
import LangContext from "../../context/LangContext";
import "./ProgressBar.css";

export default function ProgressBar(props) {
  const t = React.useContext(LangContext);

  return (
    <div className="App-progress" id={props.id || ""}>
      <div className="progress-indicator-wrapper">
        <div
          className={"grey darken-4 progress-indicator " +
            (props.active ? "active" : "")}
          style={{ width: props.progress + "%" }}
        >
        </div>
      </div>
      <label
        className={`progress-description ${(props.active ? "active" : "")}`}
      >
        <span>
          {(props.progress > 0)
            ? `${props.progress}%`
            : t("progress_bar:perf_info")}
        </span>
      </label>
    </div>
  );
}
