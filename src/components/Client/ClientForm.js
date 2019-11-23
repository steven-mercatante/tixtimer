import React, { useState } from "react";
import Button from "../atoms/Button";

export default ({ addClient }) => {
  const [name, setName] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    addClient(name);
    setName("");
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
