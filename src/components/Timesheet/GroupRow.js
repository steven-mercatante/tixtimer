import React from "react";
import { prettyPrintTime } from "../../utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import ToggleTextInput from "../ToggleTextInput";
import styled from "styled-components";
import ProjectDropdown from "../Project/ProjectDropdown";
import Time from "./Time";

const StyledDatePicker = styled(DatePicker)`
  width: 85px;
`;

const Td = styled.td`
  padding: 2px;
`;

export default function GroupRow({
  entry,
  updateEntry,
  onChangeTask,
  onChangeTime,
  assignEntryToProject,
  isSelected,
  handleToggle,
  projects
}) {
  // console.log("--- GroupRow render()");
  const { id, task, seconds, loggedFor } = entry;

  const handleDatePickerChange = date => {
    updateEntry(id, { loggedFor: date.valueOf() });
  };

  return (
    <tr>
      <Td>
        <input
          type="checkbox"
          checked={isSelected}
          onClick={handleToggle}
          onChange={() => console.log("You clicked a checkbox in GroupRow")}
        />
      </Td>
      <Td>
        <ToggleTextInput initialValue={task} onPressEnter={onChangeTask} />
      </Td>
      <Td>
        <Time seconds={seconds} /> --
        <ToggleTextInput
          initialValue={prettyPrintTime(seconds)}
          onPressEnter={onChangeTime}
        />
      </Td>
      <Td>
        {/* <StyledDatePicker
          selected={moment(loggedFor)}
          onChange={handleDatePickerChange}
          dateFormat="MM/DD/YY"
        /> */}
      </Td>
      <Td>
        <ProjectDropdown
          projects={projects}
          callback={projectId => assignEntryToProject(id, projectId)}
          selected={entry.projectId}
        />
      </Td>
    </tr>
  );
}
