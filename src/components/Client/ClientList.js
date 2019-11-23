import React, { useContext } from "react";
import ClientForm from "./ClientForm";
import ClientContext from "../../context/ClientContext";
import useSelectItems from "../../hooks/useSelectItems";
import BulkActions from "../BulkActions";
import { observer } from "mobx-react";

function ClientList({ clients }) {
  console.log("ClientList clients:", clients);
  const { _, loadClients, deleteClients } = useContext(ClientContext);

  const itemIdExtractor = item => item.id;

  const {
    selectedItems,
    unselectAllItems,
    toggleSelectItem,
    allItemsSelected,
    toggleSelectAll
  } = useSelectItems(Object.values(clients), itemIdExtractor);

  return (
    <React.Fragment>
      <ClientForm callback={loadClients} />

      {selectedItems.length > 0 && (
        <BulkActions
          deleteMsgFunc={() =>
            `Are you sure you want to delete ${selectedItems.length} clients?`
          }
          onConfirmCallback={() => {
            deleteClients(selectedItems);
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
          {Object.values(clients).map(client => (
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
