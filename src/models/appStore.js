import { types } from "mobx-state-tree";
import { ClientStore } from "./client";
import Project from "./project";

const AppStore = types
  .model("AppStore", {
    clientStore: types.optional(ClientStore, { clients: [] })
    // projects: types.array(Project)
  })
  .actions(self => ({
    afterCreate() {
      console.log("AppStore.afterCreate()");
      self.clientStore.loadClients();
    }
  }));

export default AppStore;
