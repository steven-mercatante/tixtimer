import React, { useState } from "react";
import ProjectForm from "./ProjectForm";
import { observer } from "mobx-react";
import { Button, Modal, Table, message } from "antd";

// TODO: might want to store number of items being deleted in a ref b/c the number in the message quickly changes to 0 right before the delete modal closes

function ProjectList({ clients, projectStore }) {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { projects, deleteProjects } = projectStore;

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

  function handleClickDelete() {
    console.log("handleClickDelete()");
    setDeleteModalVisible(true);
  }

  async function confirmDelete() {
    console.log("confirmDelete()");
    await deleteProjects(selectedRowKeys);
    setDeleteModalVisible(false);
    setSelectedRowKeys([]);
    message.success(`Project(s) successfully deleted.`);
  }

  // TODO: move ProjectForm out of this component
  // TODO: inflect the deleteMsg below
  return (
    <div>
      <ProjectForm clients={clients} addProject={projectStore.addProject} />
      <Button
        type="danger"
        onClick={handleClickDelete}
        disabled={!selectedRowKeys.length}
      >
        Delete
      </Button>
      <Modal
        visible={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
      >
        <p>
          {`Are you sure you want to delete ${selectedRowKeys.length} projects?`}
        </p>
      </Modal>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
      ></Table>
    </div>
  );
}

export default observer(ProjectList);
