import { types, flow } from "mobx-state-tree";
import { Client } from "./clientStore";
import { createProject, getProjects, deleteProject } from "../api";
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

    function deleteProjects(ids) {
      // TODO: does this need to be a flow function? will multiple `filter` calls dispatch multiple change events? I only want one change event to be fired after this transactional action
      ids.forEach(id => {
        try {
          deleteProject(id);
          self.projects = self.projects.filter(project => project.id !== id);
        } catch (err) {
          console.error(`Failed to delete project`, err);
        }
      });
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
        self.isLoading = false;
      } catch (err) {
        console.error("Failed to load projects", err);
      }
    });

    return {
      addProject,
      deleteProjects,
      loadProjects
    };
  });
