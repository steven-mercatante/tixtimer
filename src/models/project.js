import { types } from "mobx-state-tree";
import { Client } from "./client";

const Project = types.model("Project", {
  id: types.identifier,
  client: types.reference(Client),
  name: types.string
});

export default Project;
