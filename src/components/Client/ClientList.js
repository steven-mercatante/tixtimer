import React, { useState } from "react";
import ClientForm from "./ClientForm";
import { observer } from "mobx-react";
import { Button, Modal, Table, message } from "antd";

function ClientList({ clientStore }) {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const columns = [{ title: "Name", dataIndex: "name" }];

  const dataSource = clientStore.clients.map(client => ({
    key: client.id,
    name: client.name
  }));

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
    await clientStore.deleteClients(selectedRowKeys);
    setDeleteModalVisible(false);
    message.success(`Client(s) successfully deleted.`);
  }

  return (
    <React.Fragment>
      <ClientForm addClient={clientStore.addClient} />

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
          {`Are you sure you want to delete ${selectedRowKeys.length} clients?`}
        </p>
      </Modal>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
      ></Table>
    </React.Fragment>
  );
}

export default observer(ClientList);
