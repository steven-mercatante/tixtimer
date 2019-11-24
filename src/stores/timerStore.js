import { types, flow } from "mobx-state-tree";
import { Project } from "./projectStore";
import { createTimer, getTimers, updateTimer } from "../api";
import { getNow } from "../utils";

export const Timer = types
  .model("Timer", {
    id: types.identifierNumber,
    project: types.reference(Project),
    task: types.string,
    running: false,
    starts: types.array(types.string),
    stops: types.array(types.string)
  })
  .views(self => ({
    get totalTime() {
      return 42;
    }
  }))
  .actions(self => ({
    start() {
      console.log([...self.starts, getNow()]);
      updateTimer(self.id, { running: true });
      self.running = true;
    },

    stop() {
      console.log([...self.stops, getNow()]);
      updateTimer(self.id, { running: false });
      self.running = false;
    },

    log() {},

    setTask(task) {
      self.task = task;
    },

    setProject(projectId) {
      self.project = projectId;
    }
  }));

export const TimerStore = types
  .model("TimerStore", {
    timers: types.array(Timer),
    isLoading: true // TODO: toggle this
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
        self.timers.push(timer); // TODO: make sure you're pushing model instances?
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
