import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.scss";

interface LinkObject {
    path: string;
    name: string;
}

interface Props {
    basePath: string;
    links: LinkObject[];
}

export default function Header(props: Props) {
    const [currentPath, setCurrentPath] = useState(props.basePath);

    const links = props.links.map((value: LinkObject, i: number) =>
        <Link
            key={i}
            to={props.basePath + value.path}
            id={value.name || ""}
            className={currentPath === value.path ? "active" : ""}
            onClick={() => setCurrentPath(value.path)}
        >
            {value.name}
        </Link>
    );

    return (
        <header className="App-header grey darken-4">
            <h5 className="App-title pink-text text-darken-1">
                <small>
                    <strong><a href="https://komlosidev.net/">thavixt</a> /</strong>
                </small>
                <a href={props.basePath}>steganography.js</a>
            </h5>
            <span className="App-links pink-text text-darken-1">
                {links}
            </span>
        </header>
    );
}
