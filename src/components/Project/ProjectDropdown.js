import React, { useContext } from "react";
import ClientContext from "../../context/ClientContext";
import Dropdown from "../Dropdown";

export default ({ callback, selected }) => {
  const { projects } = useContext(ClientContext);

  const convertForDropdown = projects =>
    Object.values(projects).reduce(
      (acc, item) => {
        acc.push([item.id, item.name]);
        return acc;
      },
      [[null, "-- Select Project --"]]
    );

  return (
    <Dropdown
      items={convertForDropdown(projects)}
      callback={id => callback(id)}
      selected={selected}
    />
  );
};
