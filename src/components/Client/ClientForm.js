import React, { useState } from "react";
import Button from "../atoms/Button";
import { createClient } from "../../api";

export default ({ callback }) => {
  const [name, setName] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    createClient(name).then(_ => {
      callback();
      setName("");
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Client name</label>
      <input
        type="text"
        value={name}
        placeholder="Client name"
        onChange={e => setName(e.target.value)}
      />
      <Button type="success">SAVE</Button>
    </form>
  );
};
