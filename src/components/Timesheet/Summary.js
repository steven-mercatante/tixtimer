import React, { useEffect, useState } from "react";
import { getSummary } from "../../api";
import Time from "./Time";

function sumRows(rows) {
  return Object.values(rows).reduce((acc, row) => {
    acc += row.seconds;
    return acc;
  }, 0);
}

export default function Summary({ label, startDate, endDate }) {
  const [rows, setRows] = useState();
  useEffect(() => {
    getSummary(startDate, endDate).then(rows => {
      setRows(rows);
    });
  }, []);

  return (
    <div>
      <h3>{label}</h3>
      {rows && (
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.projectId}>
                <td>{row.projectName}</td>
                <td>
                  <Time seconds={row.seconds} />
                </td>
              </tr>
            ))}
            <tr>
              <td>
                <strong>Total</strong>
              </td>
              <td>
                <strong>
                  <Time seconds={sumRows(rows)} />
                </strong>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
