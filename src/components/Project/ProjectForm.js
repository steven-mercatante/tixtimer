import React, { useState, useRef } from "react";
import { Button, Form, Input, Select, message } from "antd";
const { Option } = Select;

export default function ProjectForm({ clients, addProject }) {
  const [projectName, setProjectName] = useState("");
  // use `undefined` instead of `null` otherwise antd Select won't show the placeholder
  const [clientId, setClientId] = useState(undefined);
  const projectInputRef = useRef(null);

  const handleSubmit = e => {
    e.preventDefault();
    if (clientId && projectName) {
      addProject(clientId, projectName);
      // !BUG: the dropdown isn't being reset even though we're calling setClientId(null)
      setClientId(undefined);
      setProjectName("");
      message.success(`Project "${projectName}" created`);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h3>Create new project</h3>
      <Select
        placeholder="Select a client"
        value={clientId}
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onChange={value => {
          setClientId(value);
          projectInputRef.current.focus();
        }}
      >
        {clients.map(client => {
          return (
            <Option key={client.id} value={client.id}>
              {client.name}
            </Option>
          );
        })}
      </Select>

      <Input
        type="text"
        ref={projectInputRef}
        value={projectName}
        placeholder="Project name"
        onChange={e => setProjectName(e.target.value)}
        onPressEnter={handleSubmit}
      />
      <Button
        type="primary"
        onClick={handleSubmit}
        disabled={
          clientId === undefined || projectName.trim() === "" || !projectName
        }
      >
        SAVE
      </Button>
    </Form>
  );
}
