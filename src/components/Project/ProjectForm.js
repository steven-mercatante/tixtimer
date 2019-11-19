import React, { useState, useContext } from "react";
import Button from "../atoms/Button";
import { createProject } from "../../api";
import ClientContext from "../../context/ClientContext";
import Dropdown from "../Dropdown";

const convertForDropdown = data =>
  Object.values(data).reduce(
    (acc, item) => {
      acc.push([item.id, item.name]);
      return acc;
    },
    [[null, "-- Select Client --"]]
  );

export default ({ callback }) => {
  const [name, setName] = useState("");
  const [clientId, setClientId] = useState(null);
  const { clients } = useContext(ClientContext);

  const handleSubmit = e => {
    e.preventDefault();
    if (clientId && name) {
      createProject(clientId, name).then(_ => {
        setClientId(null);
        setName("");
        callback();
      });
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
};
