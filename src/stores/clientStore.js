import { types, flow } from "mobx-state-tree";
import { createClient, getClients, deleteClient } from "../api";

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
    const addClient = flow(function* addClient(name) {
      try {
        const result = yield createClient(name);
        const client = Client.create({ id: result.id, name: result.name });
        self.clients.push(client);
      } catch (err) {
        console.error("Failed to create client", err);
      }
    });

    function deleteClients(ids) {
      console.log("ClientStore.deleteClients()", ids);
      ids.forEach(id => {
        try {
          deleteClient(id);
          self.clients = self.clients.filter(client => client.id !== id);
        } catch (err) {
          console.error(`Failed to delete client`, err);
        }
      });
    }

    function updateClients(clients) {
      clients.forEach(client => {
        self.clients.push(client); // TODO: make sure you're pushing model instances?
      });
    }

    const loadClients = flow(function* loadClients() {
      try {
        const clients = yield getClients();
        updateClients(clients);
        self.isLoading = false;
      } catch (err) {
        console.error("Failed to load clients", err);
      }
    });

    return {
      addClient,
      deleteClients,
      loadClients
    };
  });
