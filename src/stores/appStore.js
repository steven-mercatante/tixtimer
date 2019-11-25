import { types, flow } from "mobx-state-tree";
import { ClientStore } from "./clientStore";
import { ProjectStore } from "./projectStore";
import { TimerStore } from "./timerStore";
import { TimesheetEntryStore } from "./timesheetEntryStore";

const AppStore = types
  .model("AppStore", {
    isLoading: true,
    clientStore: types.optional(ClientStore, { clients: [] }),
    projectStore: types.optional(ProjectStore, { projects: [] }),
    timerStore: types.optional(TimerStore, { timers: [] }),
    timesheetEntryStore: types.optional(TimesheetEntryStore, { entries: [] })
  })
  .actions(self => ({
    afterCreate() {
      console.log("AppStore.afterCreate()");
      self.load();
    },

    load: flow(function* loadRequiredData() {
      /**
       * Using a flow generator function guarantees our requests to load data
       * happen synchronously, which is good because timers rely on projects, and
       * projects rely on clients.
       */
      yield self.clientStore.loadClients();
      yield self.projectStore.loadProjects();
      yield self.timerStore.loadTimers();
      // TODO: timesheet entries don't need to be loaded immediately when the app starts, but they do require clients & projects already being loaded. I'd like for them to be loaded on-demand when you first visit the timesheet screen
      self.timesheetEntryStore.loadEntries();
      self.isLoading = false;
    })
  }));

export default AppStore;
