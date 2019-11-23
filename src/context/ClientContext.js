import React, { useState, useEffect } from "react";
import {
  getClients,
  deleteClient as destroyClient,
  deleteClients as destroyClients,
  getProjects,
  deleteProject as destroyProject,
  deleteProjects as destroyProjects
} from "../api";
import { toast } from "react-toastify";
import { inflect } from "inflection";

const ClientContext = React.createContext();

const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState({});
  const [projects, setProjects] = useState({});

  const loadClients = () => {
    getClients().then(clients => setClients(clients));
  };

  const loadProjects = () => {
    getProjects().then(projects => setProjects(projects));
  };

  // useEffect(loadClients, []);
  // useEffect(loadProjects, []);

  const deleteClients = ids => {
    destroyClients(ids);
    loadClients();
    toast.success(`${ids.length} ${inflect("client", ids.length)} deleted.`);
  };

  const deleteProjects = ids => {
    destroyProjects(ids);
    loadProjects();
    toast.success(`${ids.length} ${inflect("project", ids.length)} deleted.`);
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        loadClients,
        deleteClients,
        projects,
        loadProjects,
        deleteProjects
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export { ClientProvider };
export default ClientContext;
