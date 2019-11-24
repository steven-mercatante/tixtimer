import React from "react";
import ProjectForm from "./ProjectForm";
import useSelectItems from "../../hooks/useSelectItems";
import BulkActions from "../BulkActions";
import isEmpty from "lodash/isEmpty";
import { observer } from "mobx-react";

function ProjectList({ clients, projectStore, addProject }) {
  const { projects, deleteProjects } = projectStore;
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

  // TODO: move ProjectForm out of this component
  // TODO: inflect the deleteMsg below
  return (
    <div>
      <ProjectForm clients={clients} addProject={projectStore.addProject} />
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
          {projects.map(project => (
            <tr key={project.id}>
              <td>
                <input
                  type="checkbox"
                  onClick={() => toggleSelectItem(project.id)}
                  checked={selectedItems.includes(project.id)}
                />
              </td>
              <td>{project.client.name}</td>
              <td>{project.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default observer(ProjectList);
