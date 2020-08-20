import React, { useContext } from "react";
import LangContext from "../../context/LangContext";
import "./Footer.scss";

export default function Footer() {
    const t = useContext(LangContext);

    return (
        <footer className="App-footer grey darken-4 page-footer">
            <div className="container">
                <div className="row">
                    <div className="col l6 s12">
                        <h5 className="pink-text text-darken-1">Steganography.js</h5>
                        <p className="pink-text text-darken-1">
                            {t("footer:inspired_by")} - <em>
                                <a
                                    href="https://www.youtube.com/watch?v=TWEXCYQKyDc"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Secrets Hidden in Images
                                </a>
                            </em>
                        </p>
                    </div>
                </div>
            </div>
            <div className="footer-copyright">
                <div className="container pink-text text-darken-1">
                    <a
                        className="pink-text text-darken-1 right"
                        href="https://github.com/thavixt/steganography-js"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        github
                    </a>
                </div>
            </div>
        </footer>
    );
}
