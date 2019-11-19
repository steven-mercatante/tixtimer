import React, { useContext } from "react";
import ProjectForm from "./ProjectForm";
import ClientContext from "../../context/ClientContext";
import useSelectItems from "../../hooks/useSelectItems";
import BulkActions from "../BulkActions";
import isEmpty from "lodash/isEmpty";

export default () => {
  const { clients, projects, loadProjects, deleteProjects } = useContext(
    ClientContext
  );

  const itemIdExtractor = item => item.id;

  const {
    selectedItems,
    unselectAllItems,
    toggleSelectItem,
    allItemsSelected,
    toggleSelectAll
  } = useSelectItems(Object.values(projects), itemIdExtractor);

  if (isEmpty(clients) || isEmpty(projects)) {
    // TODO: make this look good
    return <div>Loading...</div>;
  }

  // TODO: inflect the deleteMsg below
  return (
    <div>
      <ProjectForm callback={loadProjects} />
      {selectedItems.length > 0 && (
        <BulkActions
          deleteMsgFunc={() =>
            `Are you sure you want to delete ${selectedItems.length} projects?`
          }
          onConfirmCallback={() => {
            deleteProjects(selectedItems);
            unselectAllItems();
          }}
        />
      )}
      <table>
        <thead>
          <tr>
            <td>
              <input
                type="checkbox"
                onClick={toggleSelectAll}
                checked={allItemsSelected}
              />
            </td>
            <td>Client</td>
            <td>Name</td>
          </tr>
        </thead>
        <tbody>
          {Object.values(projects).map(project => (
            <tr key={project.id}>
              <td>
                <input
                  type="checkbox"
                  onClick={() => toggleSelectItem(project.id)}
                  checked={selectedItems.includes(project.id)}
                />
              </td>
              <td>{clients[project.client].name}</td>
              <td>{project.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
