import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
//import * as serviceWorker from './serviceWorker';

const basePath = process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_BASE_PATH as string
    : "/";

/** 
 * Check API support, hardware & battery, then start app & register service worker
*/
const check = () => {
    // Check for API support
    if (
        !(window.Worker && window.Promise && window.fetch &&
            window.File && window.FileReader && window.FileList &&
            window.Blob && window.TextDecoder && window.TextEncoder)
    ) {
        alert(
            "Your browser is not up-to-date. The application MAY NOT WORK. \rTry using the latest version of Chrome, Edge or Firefox.",
        );
        // Log required APIs
        console.error(
            "The required APIs are not fully supported in this browser.\nTry using the latest version of Chrome, Edge or Firefox.\nThe required APIs are:\nBlob, fetch, File, FileReader, FileList, Promise, TextDecoder, Worker",
        );
    }
    // The below checks are only really important for mobile use:
    // Check for at least 1GB usable memory (important for big image files)
    if (navigator.deviceMemory && navigator.deviceMemory < 2) {
        console.warn("Low device memory detected:", navigator.deviceMemory + "GB");
    }
    // Check for at least 3 cores / threads (main + 2 workers)
    if (navigator.hardwareConcurrency < 2) {
        console.warn(
            "Low number of CPU threads detected:",
            navigator.hardwareConcurrency,
        );
    }

    ReactDOM.render(<App basePath={basePath} />, document.getElementById("root"));

    // serviceWorker.register();
};

check();
