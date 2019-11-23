import { types, flow } from "mobx-state-tree";
import { createClient, getClients } from "../api";
import { toast } from "react-toastify";

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
        toast.success(`Client "${client.name}" created`);
      } catch (err) {
        console.error("Failed to create client", err);
      }
    });

    function deleteClient(id) {
      console.log("ClientStore.delete()", id);
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
      deleteClient,
      loadClients
    };
  });
