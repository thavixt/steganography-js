import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/Home";
import ComparisonPage from "./Pages/Comparison";
import InfoPage from "./Pages/Info";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";

export default function App(props) {
  let pages = [
    { name: "stego", path: "" },
    { name: "compare", path: "compare" },
    { name: "info", path: "info" },
    // TODO: unused Stats page?
    // { name: "stats", path: "stats" },
  ];

  return (
    <BrowserRouter>
      <div className="App">
        <Header links={pages} basePath={props.basePath} />
        <main className="App-main">
          <Route
            exact
            path={props.basePath + ""}
            render={() => <HomePage />}
          />
          <Route
            path={props.basePath + "compare"}
            render={() => <ComparisonPage />}
          />
          <Route
            path={props.basePath + "info"}
            render={() => <InfoPage />}
          />
          {/* <Route path={this.props.basePath + "stats"} render={() =>
              <StatsPage stats={this.state.stats} statsLoaded={this.state.statsLoaded} />}
            /> */}
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
