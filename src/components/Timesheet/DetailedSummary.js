import React, { useEffect, useState } from "react";
import { getDetailedSummary } from "../../api";
import eachDayOfInterval from "date-fns/eachDayOfInterval";
import format from "date-fns/format";
import Time from "./Time";

// TODO: move to utils?
function getDetailedTotals(data) {
  return Object.values(data).reduce((acc, times) => {
    Object.entries(times).forEach(([date, time]) => {
      if (acc[date]) {
        acc[date] += time;
      } else {
        acc[date] = time;
      }
    });
    return acc;
  }, {});
}

// TODO Move to utils?
function sumRow(row) {
  return Object.values(row).reduce((acc, time) => {
    acc += time;
    return acc;
  }, 0);
}

export default function DetailedSummary({ label, startDate, endDate }) {
  console.log("DetailedSummary render");
  const [data, setData] = useState();
  useEffect(() => {
    getDetailedSummary(startDate, endDate).then(data => {
      setData(data);
    });
  }, [endDate, startDate]);

  console.log("interval:", startDate, endDate);

  const dates = eachDayOfInterval({
    start: startDate,
    end: endDate
  }).map(date => format(date, "yyyy-MM-dd"));

  const detailedTotals = data ? getDetailedTotals(data) : {};
  const grandTotal = detailedTotals ? sumRow(detailedTotals) : null;

  return (
    <div>
      <h3>{label}</h3>
      {data && (
        <table>
          <thead>
            <tr>
              <th>Project</th>
              {dates.map(date => (
                <th key={`outer_${date}`}>{date}</th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([projectName, times]) => (
              <tr key={projectName}>
                <td>{projectName}</td>
                {dates.map(date => (
                  <td key={`inner_${date}`}>
                    <Time seconds={times[date]} />
                  </td>
                ))}
                <td>{times ? <Time seconds={sumRow(times)} /> : ""}</td>
              </tr>
            ))}
            <tr>
              <td>
                <strong>Total</strong>
              </td>
              {dates.map(date => (
                <td key={`total_${date}`}>
                  <strong>
                    <Time seconds={detailedTotals[date]} />
                  </strong>
                </td>
              ))}
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
