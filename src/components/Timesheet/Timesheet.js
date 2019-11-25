import React, { useEffect, useState } from "react";
import TimesheetGroup from "./TimesheetGroup";
import GroupRow from "./GroupRow";
import LogTimeForm from "./LogTimeForm";
import { updateTimesheetEntry, getTotalTimeForSearchTerm } from "../../api";
import {
  getTimesheetGroupTotalTime,
  groupTimesheetEntries,
  prettyPrintSeconds,
  toSeconds
} from "../../utils";
import styled from "styled-components";
import Summary from "./Summary";
import DetailedSummary from "./DetailedSummary";
import DateSummary from "./DateSummary";
import addWeeks from "date-fns/addWeeks";
import addMonths from "date-fns/addMonths";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import startOfMonth from "date-fns/startOfMonth";
import format from "date-fns/format";
import endOfMonth from "date-fns/endOfMonth";
import parseISO from "date-fns/parseISO";
import { observer } from "mobx-react";
import { Table } from "antd";

// TODO: clean up
const _startOfMonth = parseISO(format(startOfMonth(new Date()), "yyyy-MM-dd"));
const _endOfMonth = parseISO(format(endOfMonth(new Date()), "yyyy-MM-dd"));
const _startOfLastMonth = parseISO(
  format(startOfMonth(addMonths(new Date(), -1)), "yyyy-MM-dd")
);
const _endOfLastMonth = parseISO(
  format(endOfMonth(addMonths(new Date(), -1)), "yyyy-MM-dd")
);
const _startOfThisWeek = parseISO(
  format(startOfWeek(new Date()), "yyyy-MM-dd")
);
const _endOfThisWeek = parseISO(format(endOfWeek(new Date()), "yyyy-MM-dd"));
const _startOfLastWeek = parseISO(
  format(startOfWeek(addWeeks(new Date(), -1)), "yyyy-MM-dd")
);
const _endOfLastWeek = parseISO(
  format(endOfWeek(addWeeks(new Date(), -1)), "yyyy-MM-dd")
);

const Timesheet = styled.div`
  width: 100%;
  padding: 0 40px;
`;

const Search = ({ setSearchTerm, setSearchTermTotalTime }) => {
  const [val, setVal] = useState("");

  const search = e => {
    e.preventDefault();
    setSearchTerm(val);
    getTotalTimeForSearchTerm(val).then(result =>
      setSearchTermTotalTime(result)
    );
  };

  return (
    <form onSubmit={search}>
      <label>Search:</label>
      <input type="text" value={val} onChange={e => setVal(e.target.value)} />
      <button>Search</button>
    </form>
  );
};

export default observer(function({ timesheetEntryStore, projects }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { entries } = timesheetEntryStore;

  function assignEntryToProject(entryId, projectId) {
    // updateEntry(entryId, { projectId });
    updateTimesheetEntry(entryId, { projectId });
  }

  const columns = [
    { title: "Client", dataIndex: "client" },
    { title: "Project", dataIndex: "project" },
    { title: "Task", dataIndex: "task" },
    { title: "Time", dataIndex: "time" },
    { title: "Logged For", dataIndex: "loggedFor" }
  ];

  const dataSource = entries.map(entry => ({
    key: entry.id,
    client: entry.project.client.name,
    project: entry.project.name,
    task: entry.task,
    time: entry.seconds,
    loggedFor: entry.loggedFor
  }));

  const rowSelection = {
    selectedRowKeys,
    onChange: selectedRowKeys => {
      setSelectedRowKeys(selectedRowKeys);
    }
  };

  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={dataSource}
    ></Table>
  );
});
