import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";

export default ({ addClient }) => {
  const [name, setName] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!name) return;
    addClient(name);
    setName("");
    message.success(`Client "${name}" created`);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <label>Create client</label>
      <Input
        type="text"
        value={name}
        placeholder="Client name"
        onChange={e => setName(e.target.value)}
        onPressEnter={handleSubmit}
      />
      <Button
        type="primary"
        onClick={handleSubmit}
        disabled={name.trim() === "" || !name}
      >
        SAVE
      </Button>
    </Form>
  );
};
