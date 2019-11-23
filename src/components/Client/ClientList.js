import React from "react";
import ClientForm from "./ClientForm";
import useSelectItems from "../../hooks/useSelectItems";
import BulkActions from "../BulkActions";
import { observer } from "mobx-react";

function ClientList({ clientStore }) {
  console.log("ClientList clients:", clientStore.clients.toJSON());

  const itemIdExtractor = item => item.id;

  const {
    selectedItems,
    unselectAllItems,
    toggleSelectItem,
    allItemsSelected,
    toggleSelectAll
  } = useSelectItems(Object.values(clientStore.clients), itemIdExtractor);

  return (
    <React.Fragment>
      <ClientForm addClient={clientStore.addClient} />

      {selectedItems.length > 0 && (
        <BulkActions
          deleteMsgFunc={() =>
            `Are you sure you want to delete ${selectedItems.length} clients?`
          }
          onConfirmCallback={() => {
            clientStore.deleteClients(selectedItems);
            unselectAllItems();
          }}
        />
      )}

      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onClick={toggleSelectAll}
                checked={allItemsSelected}
              />
            </th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {clientStore.clients.map(client => (
            <tr key={client.id}>
              <td>
                <input
                  type="checkbox"
                  onClick={() => toggleSelectItem(client.id)}
                  checked={selectedItems.includes(client.id)}
                />
              </td>
              <td>{client.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
}

export default observer(ClientList);
