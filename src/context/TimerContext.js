/**
 * Manages the state for timers and provides functions to control them via the context API.
 */
import React from "react";
import {
  createTimer as createTimerDB,
  deleteTimer as deleteTimerDB,
  updateTimer as updateTimerDB,
  createTimesheetEntry
} from "../api";

import useTimers from "../hooks/useTimers";

const TimerContext = React.createContext();

const TimerProvider = ({ children }) => {
  const {
    timers,
    createTimer: _createTimer,
    deleteTimer: _deleteTimer,
    startTimer: _startTimer,
    stopTimer: _stopTimer,
    updateTimer: _updateTimer,
    stopRunningTimers: _stopRunningTimers
  } = useTimers();

  const addTimer = () => {
    stopRunningTimers();
    const timer = _createTimer();
    createTimerDB(timer.id, timer.starts[0]);
  };

  const removeTimer = id => {
    deleteTimerDB(id);
    _deleteTimer(id);
  };

  const logTime = (id, task, seconds, projectId) => {
    // console.log("logTime", id, task, seconds, projectId);
    createTimesheetEntry(id, task, seconds, Date.now(), projectId);
    removeTimer(id);
    // TODO: show toast notification
  };

  const startTimer = id => {
    stopRunningTimers();
    const starts = _startTimer(id);
    updateTimerDB(id, {
      starts: JSON.stringify(starts),
      running: true
    });
  };

  const stopTimer = id => {
    const stops = _stopTimer(id);
    updateTimerDB(id, {
      stops: JSON.stringify(stops),
      running: false
    });
  };

  function stopRunningTimers() {
    const stops = _stopRunningTimers();
    Object.entries(stops).forEach(([id, timestamps]) => {
      updateTimerDB(id, {
        stops: JSON.stringify(timestamps),
        running: false
      });
    });
  }

  const setTimerTask = (id, task) => {
    // console.log("setTimerTask", id, task);
    _updateTimer(id, { task });
    // TODO: maybe debounce this call
    updateTimerDB(id, { task });
  };

  const assignToProject = (timerId, projectId) => {
    _updateTimer(timerId, { projectId });
    updateTimerDB(timerId, { projectId });
  };

  return (
    <TimerContext.Provider
      value={{
        timers,
        addTimer,
        startTimer,
        stopTimer,
        removeTimer,
        logTime,
        setTimerTask,
        assignToProject
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export { TimerProvider };

export default TimerContext;
