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
    entries: types.array(TimesheetEntry)
  })
  .actions(self => {
    const loadEntries = flow(function* loadEntries() {
      const entries = yield getTimesheetEntries();
      console.log("loaded entries:", entries);
    });

    return {
      loadEntries
    };
  });
