import React from "react";
import { prettyPrintSeconds } from "../../utils";

export default function Time({ seconds }) {
  if (seconds) {
    return (
      <span>
        {prettyPrintSeconds(seconds)} ({(seconds / 3600).toFixed(2)})
      </span>
    );
  }
  return null;
}
