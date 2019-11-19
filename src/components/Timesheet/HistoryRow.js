import React, { Component } from "react";
import { prettyPrintTime } from "../../utils";

class HistoryRow extends Component {
  render() {
    const { start, stop } = this.props;

    return (
      <tr>
        <td>{format(start, "hh:mm:ss a")}</td>
        <td>{format(stop, "hh:mm:ss a")}</td>
        <td>{prettyPrintTime(stop - start)}</td>
      </tr>
    );
  }
}

export default HistoryRow;
