import React from "react";

export default function About(props) {
  const statsList = props.statsLoaded ? (props.stats) : (<tr>
    <td>Loading...</td>
    <td>Loading...</td>
    <td>Loading...</td>
  </tr>);

  return (
    <div className="App-content pad-top">
      <h5 className="section-title">Statistics</h5>
      <p>Last 100 operations - updated every 5 minutes</p>

      <div className="section-content">
        <table className="responsive highlight">
          <thead>
            <tr>
              <th>Process type</th>
              <th>Avg. time (ms)</th>
              <th>Avg. data processed (bytes)</th>
            </tr>
          </thead>

          <tbody>
            {statsList}
          </tbody>
        </table>
      </div>
    </div>
  );
}
