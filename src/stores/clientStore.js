import { types, flow } from "mobx-state-tree";
import { createClient, getClients } from "../api";

export const Client = types.model("Client", {
  id: types.identifierNumber,
  name: types.string
});

export const ClientStore = types
  .model("ClientStore", {
    clients: types.array(Client),
    isLoading: true // TODO: toggle this
  })
  .actions(self => {
    function setLoading(loading) {
      self.isLoading = loading;
    }

    const addClient = flow(function* addClient(name) {
      try {
        const client = yield createClient(name);
        self.clients.push({ id: client.id, name: client.name });
      } catch (err) {
        console.error("Failed to create client", err);
      }
    });

    function deleteClient(id) {
      console.log("ClientStore.delete()", id);
    }

    function updateClients(clients) {
      clients.forEach(client => {
        self.clients.push(client);
      });
    }

    const loadClients = flow(function* loadClients() {
      try {
        const clients = yield getClients();
        updateClients(clients);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load clients", err);
      }
    });

    return {
      addClient,
      deleteClient,
      loadClients
    };
  });
