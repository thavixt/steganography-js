import React, { Component } from "react";
import "./Footer.css";

export default class Footer extends Component {
    render() {
        return (
            <footer className="App-footer deep-purple darken-4 page-footer">
                <div className="container">
                    <div className="row">
                        <div className="col l6 s12">
                            <h5 className="yellow-text text-darken-1">Steganography.js</h5>
                            <p className="yellow-text text-darken-1">
                                Inspired by Computerphile's video - <em><a href="https://www.youtube.com/watch?v=TWEXCYQKyDc" target="_blank" rel="noopener noreferrer">Secrets Hidden in Images</a></em></p>
                        </div>
                        <div className="col l4 offset-l2 s12">
                            <h5 className="yellow-text text-darken-1">Built with</h5>
                            <ul>
                                <li><a className="yellow-text text-darken-1"
                                    href="https://reactjs.org/"
                                    target="_blank" rel="noopener noreferrer">React</a>
                                </li>
                                <li><a className="yellow-text text-darken-1"
                                    href="http://materializecss.com/"
                                    target="_blank" rel="noopener noreferrer">Materialize</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="footer-copyright">
                    <div className="container">
                        {/* © {new Date().getFullYear()} Péter Komlósi */}
                        Website made by Péter Komlósi
                        <a className="grey-text text-lighten-4 right" href="https://github.com/thavixt" target="_blank" rel="noopener noreferrer">github</a>
                    </div>
                </div>
            </footer>
        )
    }
}
