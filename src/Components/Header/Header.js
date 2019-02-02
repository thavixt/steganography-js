import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import createHistory from "history/createBrowserHistory";

export default class Header extends Component {
    render() {
        // createBrowserHistory is for use in modern web browsers that support the HTML5 history API
        const history = createHistory({
            basename: this.props.basePath || "/", // The base URL of the app (see below)
        });
        // Create links for each path provided and highlight the active path
        const links = this.props.links.map((value, i, arr) =>
            <Link key={i}
                to={this.props.basePath + value.path}
                id={value.id || ""}
                className={history.location.pathname === value.path ? "active" : ""}>
                {value.name}
            </ Link>
        );
        // Is there an IntroJs guide function for the current path?
        const currentGuide = this.props.links.find((value) => {
            return history.location.pathname === "/" + value.path;
        });

        return (
            <header className="App-header deep-purple darken-4">
                <h5 className="App-title yellow-text text-darken-1">
                    <small>
                        <strong><a href={"https://komlosidev.net/"}>thavixt</a> / </strong>
                    </small>
                    <a href={this.props.basePath}>steganography.js</a>
                </h5>
                <span className="App-links yellow-text text-darken-1">
                    {links}
                    {!!currentGuide && currentGuide.hasOwnProperty('intro') &&
                        <a style={{ cursor: "pointer" }} id="roll-intro"
                            onClick={() => currentGuide.intro()}> guide
                        </a>
                    }
                </span>
            </header>
        )
    }
}
