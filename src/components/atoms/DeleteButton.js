import React from "react";
import Button from "./Button";

export default ({ callback }) => (
  <Button type="danger" onClick={callback}>
    X
  </Button>
);
