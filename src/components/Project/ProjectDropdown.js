import React from "react";
import Dropdown from "../Dropdown";

export default function ProjectDropdown({ projects, callback, selected }) {
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
}
