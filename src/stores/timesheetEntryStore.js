import { types, flow } from "mobx-state-tree";
import { Project } from "./projectStore";
import { getTimesheetEntries } from "../api";

export const TimesheetEntry = types.model("TimesheetEntry", {
  project: types.reference(Project),
  id: types.identifierNumber,
  task: types.string,
  notes: types.string,
  seconds: types.number,
  loggedFor: types.string
});

export const TimesheetEntryStore = types
  .model("TimesheetEntryStore", {
    entries: types.array(TimesheetEntry),
    isLoading: true
  })
  .actions(self => {
    function updateEntries(entries) {
      entries.forEach(entry => {
        self.entries.push({
          id: entry.id,
          task: entry.task,
          project: entry.project,
          loggedFor: entry.logged_for,
          seconds: entry.seconds,
          notes: entry.notes
        });
      });
    }

    const loadEntries = flow(function* loadEntries() {
      const entries = yield getTimesheetEntries();
      updateEntries(entries);
      self.isLoading = false;
    });

    return {
      loadEntries
    };
  });
