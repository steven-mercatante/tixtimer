import React, { useState } from "react";

export default ({ initialValue, onChange, onPressEnter }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [tmpValue, setTmpValue] = useState(initialValue);

  if (value !== initialValue) {
    setValue(initialValue);
    setTmpValue(initialValue);
  }

  const toggle = () => setEditing(!editing);

  const reset = () => {
    setTmpValue(value);
    setEditing(false);
  };

  const handleChange = event => {
    const { value } = event.target;
    setTmpValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  const handleKeyPress = event => {
    // console.log("handleKeyPress()", event.key);
    if (event.key === "Enter" && onPressEnter) {
      setValue(tmpValue);
      onPressEnter(tmpValue);
      setEditing(false);
    }
  };

  const handleKeyDown = event => {
    // console.log("handleKeyDown()", event.key);
    if (event.key === "Escape") {
      reset();
    }
  };

  if (editing) {
    return (
      <input
        type="text"
        autoFocus={true}
        value={tmpValue}
        onBlur={reset}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        onKeyDown={handleKeyDown}
      />
    );
  }

  return <span onClick={toggle}>{value}</span>;
};
