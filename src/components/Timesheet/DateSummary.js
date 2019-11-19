import React, { useEffect, useState } from "react";
import { getSummaryForDate } from "../../api";
import Time from "./Time";

export default function DateSummary({ label, forDate }) {
  const [datum, setDatum] = useState();
  useEffect(() => {
    getSummaryForDate(forDate).then(datum => {
      setDatum(datum);
    });
  }, []);

  const grandTotal = datum
    ? Object.values(datum).reduce((acc, data) => {
        acc += data.totalTime;
        return acc;
      }, 0)
    : 0;

  return (
    <div>
      <h3>{label}</h3>
      {datum && (
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {datum.map((data, i) => (
              <tr key={i}>
                <td>{data.projectName}</td>
                <td>
                  <Time seconds={data.totalTime} />
                </td>
              </tr>
            ))}
            <tr>
              <td>
                <strong>Total</strong>
              </td>
              <td>
                <strong>
                  <Time seconds={grandTotal} />
                </strong>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
