import React, { useState } from "react";
import Button from "../atoms/Button";
import { Select } from "antd";
const { Option } = Select;

export default function ProjectForm({ clients, addProject }) {
  const [name, setName] = useState("");
  const [clientId, setClientId] = useState(null);

  const handleSubmit = e => {
    e.preventDefault();
    if (clientId && name) {
      addProject(clientId, name);
      // !BUG: the dropdown isn't being reset even though we're calling setClientId(null)
      setClientId(null);
      setName("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create new project</h3>
      <Select
        placeholder="Select a client"
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onChange={value => {
          setClientId(value);
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

      <input
        type="text"
        value={name}
        placeholder="Project name"
        onChange={e => setName(e.target.value)}
      />
      <Button type="success">SAVE</Button>
    </form>
  );
}
