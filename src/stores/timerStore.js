import { types, flow } from "mobx-state-tree";
import { Project } from "./projectStore";
import { createTimer, getTimers, updateTimer, _post, _patch } from "../api";
import { getHistoricTime } from "../utils";

export const Timer = types
  .model("Timer", {
    id: types.identifierNumber,
    project: types.reference(Project),
    task: types.string,
    running: false,
    starts: types.array(types.number),
    stops: types.array(types.number)
  })
  .views(self => ({
    get historicTime() {
      return getHistoricTime(self.starts, self.stops);
    }
  }))
  .actions(self => {
    const start = flow(function* start() {
      yield updateTimer(self.id, { running: true });
      const start = yield _post(`timerstarts`, { timer: self.id });
      self.starts.push(start.created_at);
      self.running = true;
    });

    const stop = flow(function* stop() {
      yield updateTimer(self.id, { running: false });
      const stop = yield _post(`timerstops`, { timer: self.id });
      self.stops.push(stop.created_at);
      self.running = false;
    });

    function log() {
      console.log("log:", self.getTotalTime());
    }

    const setTask = flow(function* setTask(task) {
      yield _patch(`timers/${self.id}/`, { task });
      self.task = task;
    });

    const setProject = flow(function* setProject(projectId) {
      yield _patch(`timers/${self.id}/`, { project: projectId });
      self.project = projectId;
    });

    return {
      start,
      stop,
      log,
      setTask,
      setProject
    };
  });

export const TimerStore = types
  .model("TimerStore", {
    timers: types.array(Timer),
    isLoading: true
  })
  .actions(self => {
    const addTimer = flow(function* addTimer(projectId, task) {
      try {
        const timer = yield createTimer(projectId, task);
        self.timers.push({
          id: timer.id,
          task: timer.task,
          client: timer.client
        });
      } catch (err) {
        console.error("Failed to create timer", err);
      }
    });

    function deleteTimer(id) {
      console.log("TimerStore.delete()", id);
      // TODO: call API
      self.timers = self.timers.filter(timer => timer.id !== id);
    }

    function updateTimers(timer) {
      timer.forEach(timer => {
        self.timers.push(timer);
      });
    }

    const loadTimers = flow(function* loadTimers() {
      try {
        const timers = yield getTimers();
        updateTimers(timers);
        self.isLoading = false;
      } catch (err) {
        console.error("Failed to load timers", err);
      }
    });

    return {
      addTimer,
      deleteTimer,
      loadTimers
    };
  });
