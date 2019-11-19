import React, { Component } from "react";
import zip from "lodash/zip";
import HistoryRow from "./HistoryRow";

class TimerHistory extends Component {
  render() {
    const { starts, stops } = this.props;
    const zipped = zip(starts, stops);

    return (
      <table>
        <thead>
          <tr>
            <th>Start</th>
            <th>Stop</th>
            <th>Δ</th>
          </tr>
        </thead>
        <tbody>
          {zipped.map(([start, stop], i) => (
            <HistoryRow key={i} start={start} stop={stop} />
          ))}
        </tbody>
      </table>
    );
  }
}

export default TimerHistory;
