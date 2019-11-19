import React from "react";
import styled from "styled-components";
import { prettyPrintTime } from "../../utils";
import format from "date-fns/format";

const Table = styled.table`
  table-layout: fixed;
  width: 100%;

  .checkbox {
    width: 3%;
  }

  .task {
    width: 45%;
  }
`;

export default ({
  label,
  totalTime,
  children,
  selectChildren,
  entriesAreSelected
}) => {
  // console.log("--- TimesheetGroup render()");
  const prettyDate = format(label, "dddd, MMM Do yyyy");
  const prettyTime = prettyPrintTime(totalTime);
  const timeFraction = (totalTime / 3600).toFixed(2);

  return (
    <div>
      <h5>
        {prettyDate} ({prettyTime} - {timeFraction})
      </h5>
      <Table>
        <thead>
          <tr>
            <th className="checkbox">
              <input
                type="checkbox"
                onClick={selectChildren}
                checked={entriesAreSelected}
                onChange={event =>
                  console.log(
                    "You clicked a checkbox in TimesheetGroup!",
                    event
                  )
                }
              />
            </th>
            <th className="task" />
            <th className="time" />
            <th className="date" />
            <th className="project" />
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </Table>
    </div>
  );
};
