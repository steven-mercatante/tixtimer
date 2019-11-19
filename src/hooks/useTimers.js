import { useEffect, useReducer, useState } from "react";
import uuid from "uuid/v4";
import { getNow } from "../utils";
import { getTimers } from "../api";

function reducer(state, action) {
  //   console.log("useTimers action:", action);
  switch (action.type) {
    case "load_timers": {
      return action.timers;
    }

    case "create_timer": {
      const { timer } = action;
      return { ...state, [timer.id]: timer };
    }

    case "update_timer": {
      const { type, id, ...rest } = action;
      const timer = state[id];
      return { ...state, [id]: { ...timer, ...rest } };
    }

    case "delete_timer": {
      const { [action.id]: deleted, ...newState } = state;
      return newState;
    }

    case "stop_timers": {
      const stoppedTimers = action.ids.reduce((acc, id) => {
        acc[id] = { ...state[id], running: false };
        return acc;
      }, {});
      return { ...state, ...stoppedTimers };
    }

    default:
      throw new Error();
  }
}

export default function useTimers() {
  const initialState = {};
  const [timers, dispatch] = useReducer(reducer, initialState);
  const [_, setCounter] = useState(0);

  // Fetch all timers on initial render
  useEffect(() => {
    getTimers().then(resp => {
      const timers = resp.reduce((acc, timer) => {
        timer.starts = JSON.parse(timer.starts);
        timer.stops = JSON.parse(timer.stops);
        acc[timer.id] = timer;
        return acc;
      }, {});

      dispatch({ type: "load_timers", timers });
    });
  }, []);

  // Increment running timers
  useEffect(() => {
    const interval = setInterval(() => {
      const timersRunning = Object.values(timers).some(t => t.running);
      if (timersRunning) {
        setCounter(counter => counter + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  });

  function createTimer() {
    const timer = {
      id: uuid(),
      task: "",
      running: true,
      starts: [getNow()],
      stops: []
    };
    dispatch({ type: "create_timer", timer });
    return timer;
  }

  function deleteTimer(id) {
    dispatch({ type: "delete_timer", id });
  }

  function startTimer(id) {
    const starts = [...timers[id].starts, getNow()];
    dispatch({
      type: "update_timer",
      id,
      running: true,
      starts
    });
    return starts;
  }

  function stopTimer(id) {
    const stops = [...timers[id].stops, getNow()];
    dispatch({
      type: "update_timer",
      id,
      running: false,
      stops
    });
    return stops;
  }

  function stopRunningTimers() {
    const stops = Object.entries(timers)
      .filter(([id, timer]) => timer.running)
      .reduce((acc, [id, timer]) => {
        const stops = stopTimer(id);
        acc[id] = stops;
        return acc;
      }, {});

    return stops;
  }

  function updateTimer(id, data) {
    dispatch({ type: "update_timer", id, ...data });
  }

  return {
    timers,
    dispatch,
    startTimer,
    stopTimer,
    stopRunningTimers,
    createTimer,
    updateTimer,
    deleteTimer
  };
}
