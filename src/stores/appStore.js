import { types, flow } from "mobx-state-tree";
import { ClientStore } from "./clientStore";
import { ProjectStore } from "./projectStore";

const AppStore = types
  .model("AppStore", {
    isLoading: true,
    clientStore: types.optional(ClientStore, { clients: [] }),
    projectStore: types.optional(ProjectStore, { projects: [] })
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
      self.isLoading = false;
    })
  }));

export default AppStore;
