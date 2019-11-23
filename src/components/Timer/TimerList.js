import React from "react";
import Timer from "./Timer";
import { observer } from "mobx-react";

function TimerList({ timerStore, projects }) {
  return (
    <div>
      {timerStore.timers.map(timer => (
        <Timer key={timer.id} timer={timer} projects={projects} />
      ))}
    </div>
  );
}

export default observer(TimerList);
