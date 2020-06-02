import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.js";
// import registerServiceWorker from './registerServiceWorker';

const basePath = process.env.NODE_ENV === "production"
  ? "/projects/steganography-js/"
  : "/";

/** 
 * Check API support, hardware & battery, then start app & register service worker
*/
const check = () => {
  //let start = performance.now();

  // Check for API support
  if (
    !(window.Worker && window.Promise && window.fetch &&
      window.File && window.FileReader && window.FileList &&
      window.Blob && window.TextDecoder)
  ) {
    alert(
      "The required APIs are not fully supported in this browser. \rTry using the latest version of Chrome, Edge or Firefox.",
    );
    // Log required APIs
    console.error(
      "The required APIs are not fully supported in this browser.\nTry using the latest version of Chrome, Edge or Firefox.\nThe required APIs are:\nBlob, fetch, File, FileReader, FileList, Promise, TextDecoder, Worker",
    );
  }
  // The below checks are only really important for mobile use:
  // Check for at least 1GB usable memory (important for big image files)
  if (navigator.deviceMemory < 2) {
    //alert("Note:\nLow available device memory detected.\nYou may experience bad performance and/or freezing.");
    //alert("Low device memory detected:", navigator.deviceMemory);
    console.warn("Low device memory detected:", navigator.deviceMemory + "GB");
  }
  // Check for at least 3 cores / threads (main + 2 workers)
  if (navigator.hardwareConcurrency < 4) {
    //alert("Note:\nLow number of available CPU cores/threads detected.\nYou may experience bad performance and/or freezing.");
    //alert("Low number of CPU cores/threads detected:", navigator.hardwareConcurrency);
    console.warn(
      "Low number of CPU threads detected:",
      navigator.hardwareConcurrency,
    );
  }
  // Check battery status (relevant for mobile devices)
  /* navigator.getBattery().then(
        // success
        (battery) => {
            if (battery.level < 0.5 && !battery.charging) {
                //alert("Note:\nThis application may drain your battery faster than usual.\nMake sure to plug in your charger!");
                console.info("Battery level is low:", battery.level * 100 + "%");
            }
            //console.log("Battery level:", battery.level * 100 + "%", "and " + (battery.charging ? "charging" : "not charging"));
        },
        // failure
        (error) => {
            console.info("Battery status unknown.");
        }
    ) */
  //console.log("(took " + (performance.now() - start).toFixed(2) + " ms.)");

  ReactDOM.render(<App basePath={basePath} />, document.getElementById("root"));

  // registerServiceWorker();
};

check();
