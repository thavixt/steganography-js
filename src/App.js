import React, { Component } from "react";
import { BrowserRouter, Route } from 'react-router-dom'

import "./App.css";

// intro.js
import { introJs } from "intro.js";
import "intro.js/introjs.css";
//import "intro.js/themes/introjs-modern.css";

// Noty.js
import Noty from "noty";
import 'noty/lib/noty.css';
import 'noty/lib/themes/semanticui.css';

// Pages
import HomePage from "./Pages/Home";
import ComparisonPage from "./Pages/Comparison";
import InfoPage from "./Pages/Info";
//import AboutPage from "./Pages/About";
//import StatsPage from "./Pages/Stats";

// Components
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";

// Root component
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statsLoaded: false,
      stats: null,
    }
  }

  componentDidMount() {
    // Check if it's a first time visit
    //this.deleteCookie("visited");
    const hasVisited = !!this.readCookie("visited");
    if (!hasVisited || hasVisited === null) {
      this.createCookie("visited", "true", 30);
      console.log("%c First time visitor. Congrats! ", " background-color: purple; color: yellow; ");

      // Greet the user
      let greeter = new Noty({
        theme: "semanticui",
        type: "alert",
        layout: "bottomRight",
        text: "<strong>Welcome!</strong> <br/> If this is your first time using this site, click the <strong>Start guide</strong> button or the <strong>/guide</strong> link at the top on any page to start an intro about the page's functionality.",
        buttons: [
          Noty.button("Start guide", "waves-effect waves-light btn purple darken-4", () => {
            greeter.close();
            this.rollHomeIntro();
          }),
          Noty.button("Dismiss", "waves-effect waves-light btn yellow darken-1 black-text", () => {
            greeter.close();
          })
        ]
      });
      greeter.show();

    }

    // Fetch data of the last 100 processes
    // this.getStats()
    // .then(data => this.processStats(JSON.parse(data)));
  }

  createCookie(name, value, days) {
    var expires;
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
    }
    else {
      expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  }
  readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }
  deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  rollHomeIntro() {
    var intro = introJs();
    intro.onafterchange(function(targetElement) { });
    intro.setOptions({
      hidePrev: true, // Hide previous button in the first step? Otherwise, it will be disabled button.
      hideNext: true, // Hide next button in the last step? Otherwise, it will be disabled button.
      exitOnEsc: false, // Exit introduction when pressing Escape button, true or false
      exitOnOverlayClick: false, // Exit introduction when clicking on overlay layer, true or false
      scrollToElement: true, // Auto scroll to highlighted element if it’s outside of viewport, true or false
      steps: [ // For defining steps using JSON configuration
        {
          intro: "Hi! Welcome to Steganography.js, an online digital steganographic tool.<br/><br/>Steganography allows you to hide data in files without <em>seemingly</em> modifying it."
        },
        {
          element: document.querySelector('#source-section'),
          intro: "First, you'll need a source image.<br/><br/>Load an image file, then press <strong>Decode</strong>.",
          position: 'right'
        },
        {
          element: document.querySelector('#stego-progressbar'),
          intro: "You can track the progress of the current process at the top.",
          position: 'bottom'
        },
        {
          element: document.querySelector('#result-section'),
          intro: "The decoded hidden content of your image appears on the right side.",
          position: 'left'
        },
        {
          element: document.querySelector('#result-section'),
          intro: "Select another, smaller image and press <strong>Encode</strong> to hide it in the left-side image.",
          position: 'left'
        },
        {
          element: document.querySelector('#source-section'),
          intro: "The right-hand side image is now hidden in this image file. You can download it and/or decode it to see the original hidden image.<br/><br/>Click <strong>Decode</strong> now to see your hidden image!",
          position: 'right'
        },
        {
          element: document.querySelector('#result-section'),
          intro: "Your secret image starts at the top left corner.<br/><br/><strong>Note</strong>: It might not be perfect.",
          position: 'left'
        },
        {
          element: document.querySelector('#io-selector'),
          intro: "You can also hide text inside images.",
          position: 'bottom'
        },
        {
          element: document.querySelector('#compare'),
          intro: "In the 'Compare' section, you can compare two images to highlight the changed pixels.",
          position: 'bottom'
        },
        {
          element: document.querySelector('#read-more'),
          intro: "Click here to read more about what is happening behind the scenes.",
          position: 'bottom'
        },
      ]
    });
    intro.start();
  }
  rollCompareIntro() {
    var intro = introJs();
    intro.onafterchange(function(targetElement) { });
    intro.setOptions({
      hidePrev: true, // Hide previous button in the first step? Otherwise, it will be disabled button.
      hideNext: true, // Hide next button in the last step? Otherwise, it will be disabled button.
      exitOnEsc: false, // Exit introduction when pressing Escape button, true or false
      exitOnOverlayClick: false, // Exit introduction when clicking on overlay layer, true or false
      scrollToElement: true, // Auto scroll to highlighted element if it’s outside of viewport, true or false
      steps: [ // For defining steps using JSON configuration
        {
          intro: "Here you can compare an image with a tampered version of itself to highlight the pixels that are different from the original.",
        },
        {
          element: document.querySelector("#first-section"),
          intro: "Select the source image (the original).",
          position: 'right'
        },
        {
          element: document.querySelector("#second-section"),
          intro: "Select the modified version of the original image.",
          position: 'right'
        },
        {
          element: document.querySelector("#highlight-section"),
          intro: "Select a color to highlight the difference with, then click <strong>Compare</strong>.",
          position: 'right'
        },
      ]
    });
    intro.start();
  }

  /* async getStats() {
    let url = "https://ruf7yqfxpj.execute-api.eu-central-1.amazonaws.com/prod/stego-dynamoDB-getAllItems";
    // Set headers
    let headers = new Headers();
    headers.append('accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('cache-control', 'public');
    headers.append('pragma', '');
    // Fetch data
    let response = await fetch(url, headers);
    let data = await response.json();
    //console.log(data);
    return data;
  } */

  /* processStats(stats) {
    let averages = [];
    averages.push(
      getAverages(stats.filter(item => item.function.S === "decode"), "decode"),
      getAverages(stats.filter(item => item.function.S === "encode"), "encode"),
      getAverages(stats.filter(item => item.function.S === "diff"), "compare")
    );
    this.setState({ statsLoaded: true, stats: averages });
    return true;

    function formatStats(item) {
      return (
        <tr key={item.processName}>
          <td key={item.processName + "-name"}>{item.processName}</td>
          <td key={item.processName + "-time"}>{item.averageTime}</td>
          <td key={item.processName + "-bytes"}>{item.averageBytes}</td>
        </tr>
      )
    }
    function getAverages(data, name) {
      let stats = {
        processName: name,
        averageTime:
          ((data.reduce((acc, value, index) =>
            acc += parseInt(value.processTime.N, 10), 0)
          ) / data.length).toFixed(),
        averageBytes:
          ((data.reduce((acc, value, index) =>
            acc += (parseInt(value.resultBytes.N, 10) + parseInt(value.payloadBytes.N, 10)), 0)
          ) / data.length).toFixed(),
      }
      return formatStats(stats);
    }
  } */

  render() {
    let pages = [
      { name: "stego", path: "", intro: this.rollHomeIntro },
      { name: "compare", path: "compare", id: "compare", intro: this.rollCompareIntro },
      { name: "info", path: "info", id: "read-more" },
      // { name: "stats", path: "stats" },
    ];

    return (
      <BrowserRouter>
        <div className="App">
          <Header links={pages} basePath={this.props.basePath} />

          <main className="App-main">
            <Route exact path={this.props.basePath + ""} render={() => <HomePage />} />
            <Route path={this.props.basePath + "compare"} render={() => <ComparisonPage />} />
            <Route path={this.props.basePath + "info"} render={() => <InfoPage />} />
            {/* <Route path={this.props.basePath + "stats"} render={() =>
              <StatsPage stats={this.state.stats} statsLoaded={this.state.statsLoaded} />}
            /> */}
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    )
  }
}
