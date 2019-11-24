import React, { useState } from "react";
import ProjectForm from "./ProjectForm";
import useSelectItems from "../../hooks/useSelectItems";
import BulkActions from "../BulkActions";
import isEmpty from "lodash/isEmpty";
import { observer } from "mobx-react";
import { Table } from "antd";

function ProjectList({ clients, projectStore }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { projects, deleteProjects } = projectStore;
  const itemIdExtractor = item => item.id;

  const { selectedItems, unselectAllItems } = useSelectItems(
    Object.values(projects),
    itemIdExtractor
  );

  if (isEmpty(clients) || isEmpty(projects)) {
    // TODO: make this look good
    return <div>Loading...</div>;
  }

  const columns = [
    { title: "Client", dataIndex: "client" },
    { title: "Project", dataIndex: "project" }
  ];

  const dataSource = projects.map(project => {
    return {
      key: project.id,
      client: project.client.name,
      project: project.name
    };
  });

  const rowSelection = {
    selectedRowKeys,
    onChange: selectedRowKeys => {
      setSelectedRowKeys(selectedRowKeys);
    }
  };

  // TODO: move ProjectForm out of this component
  // TODO: inflect the deleteMsg below
  return (
    <div>
      <ProjectForm clients={clients} addProject={projectStore.addProject} />
      {selectedRowKeys.length > 0 && (
        <BulkActions
          deleteMsgFunc={() =>
            `Are you sure you want to delete ${selectedRowKeys.length} projects?`
          }
          onConfirmCallback={() => {
            deleteProjects(selectedRowKeys);
            unselectAllItems();
          }}
        />
      )}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
      ></Table>
    </div>
  );
}

export default observer(ProjectList);
