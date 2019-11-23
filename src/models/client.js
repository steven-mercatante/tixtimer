import { types, flow, onPatch } from "mobx-state-tree";
import { createClient, getClients } from "../api";

export const Client = types.model("Client", {
  id: types.identifier,
  name: types.string
});

export const ClientStore = types
  .model("ClientStore", {
    clients: types.array(Client),
    isLoading: true
  })
  .actions(self => {
    const addClient = flow(function* addClient(name) {
      console.log("ClientStore.add()", name);
      try {
        const client = yield createClient(name);
        self.clients.push({ id: String(client.id), name: client.name });
      } catch (err) {
        console.error("Failed to create client", err);
      }
    });

    function deleteClient(id) {
      console.log("ClientStore.delete()", id);
    }

    function updateClients(clients) {
      clients.forEach(client => {
        self.clients.push({ ...client, id: String(client.id) });
      });
    }

    const loadClients = flow(function* loadClients() {
      console.log("loadClients()");
      try {
        const clients = yield getClients();
        updateClients(clients);
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
