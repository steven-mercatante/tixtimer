import React, { useState } from "react";

export default ({ items, selected = null, callback = null }) => {
  const [value, setValue] = useState();

  const handleChange = e => {
    const val = e.target.value;
    setValue(val);

    if (callback) {
      callback(val);
    }
  };

  const selectedValue = selected !== null ? selected : value;

  return (
    <select value={selectedValue} onChange={handleChange}>
      {items.map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};
