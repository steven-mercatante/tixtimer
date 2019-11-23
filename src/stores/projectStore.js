import { types, flow } from "mobx-state-tree";
import { Client } from "./clientStore";
import { createProject, getProjects } from "../api";
import { toast } from "react-toastify";

export const Project = types.model("Project", {
  id: types.identifierNumber,
  client: types.reference(Client),
  name: types.string
});

export const ProjectStore = types
  .model("ProjectStore", {
    projects: types.array(Project),
    isLoading: true // TODO: toggle this
  })
  .actions(self => {
    function setLoading(loading) {
      self.isLoading = loading;
    }

    const addProject = flow(function* addProject(clientId, name) {
      try {
        const result = yield createProject(clientId, name);
        const project = Project.create({
          id: result.id,
          name: result.name,
          client: result.client
        });
        self.projects.push(project);
        toast.success(`Project "${project.name}" created`);
      } catch (err) {
        console.error("Failed to create project", err);
      }
    });

    function deleteProject(id) {
      console.log("ProjectStore.delete()", id);
    }

    function updateProjects(project) {
      project.forEach(project => {
        self.projects.push(project); // TODO: make sure you're pushing model instances?
      });
    }

    const loadProjects = flow(function* loadProjects() {
      try {
        const projects = yield getProjects();
        updateProjects(projects);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load projects", err);
      }
    });

    return {
      addProject,
      deleteProject,
      loadProjects
    };
  });
