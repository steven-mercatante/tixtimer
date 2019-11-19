import React, { useContext } from "react";
import Timer from "./Timer";
import TimerContext from "../../context/TimerContext";

export default () => {
  const { timers } = useContext(TimerContext);

  return (
    <div>
      {Object.values(timers).map(timer => (
        <Timer key={timer.id} timer={timer} />
      ))}
    </div>
  );
};
