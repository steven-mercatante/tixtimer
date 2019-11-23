import React from "react";
import Timer from "./Timer";
import { observer } from "mobx-react";

function TimerList({ timerStore }) {
  return (
    <div>
      {timerStore.timers.map(timer => (
        <Timer key={timer.id} timer={timer} />
      ))}
    </div>
  );
}

export default observer(TimerList);
