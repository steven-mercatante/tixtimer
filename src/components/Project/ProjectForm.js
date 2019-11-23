import React, { useState } from "react";
import Button from "../atoms/Button";
import Dropdown from "../Dropdown";

const convertForDropdown = data =>
  data.reduce(
    (acc, item) => {
      acc.push([item.id, item.name]);
      return acc;
    },
    [[null, "-- Select Client --"]]
  );

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
      <label>Project name</label>
      <Dropdown
        items={convertForDropdown(clients)}
        callback={clientId => setClientId(clientId)}
      />
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
