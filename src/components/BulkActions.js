import React, { useState, useContext } from "react";
import Dropdown from "./Dropdown";
import ModalContext from "../context/ModalContext";

export default ({ deleteMsgFunc, onConfirmCallback }) => {
  const [selectedAction, setSelectedAction] = useState("");
  const { showModal } = useContext(ModalContext);

  return (
    <Dropdown
      items={[[null, "Actions"], ["delete", "Delete"]]}
      selected={selectedAction}
      callback={val => {
        setSelectedAction(val);

        if (val === "delete") {
          showModal("CONFIRM", {
            msg: deleteMsgFunc(),
            onConfirm: onConfirmCallback,
            onCancel: () => setSelectedAction("")
          });
        }
      }}
    />
  );
};
