import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header(props) {
  const [currentPath, setCurrentPath] = React.useState(props.basePath);

  const links = props.links.map((value, i) =>
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
