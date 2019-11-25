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
import { Form, Input, InputNumber, Table } from "antd";

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

const Container = styled.div`
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

const EditableContext = React.createContext();

function EditableCell(props) {
  function getInput() {
    if (props.inputType === "number") {
      return <InputNumber />;
    }
    return <Input />;
  }

  function renderCell({ getFieldDecorator }) {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: record[dataIndex]
            })(getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  }

  return <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>;
}

function EditableTable({ form, entries }) {
  console.log("EditableTable.render()");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = record => record.key === editingKey;

  const edit = key => {
    setEditingKey(key);
  };

  function handleSave(form, key) {
    console.log("handleSave()");
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      // TODO: check if any data changed before updating MST & DB
      console.log("row:", row);
    });
    setEditingKey("");
  }

  const columns = [
    { title: "Client", dataIndex: "client" },
    { title: "Project", dataIndex: "project" },
    { title: "Task", dataIndex: "task", editable: true },
    { title: "Time", dataIndex: "time", editable: true },
    // { title: "Date", dataIndex: "date" },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <EditableContext.Consumer>
              {form => (
                <button onClick={() => handleSave(form, record.key)}>
                  Save
                </button>
              )}
            </EditableContext.Consumer>
          </span>
        ) : (
          <button onClick={() => edit(record.key)}>Edit</button>
        );
      }
    }
  ].map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: record => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });

  const dataSource = entries.map(entry => ({
    key: entry.id,
    client: entry.project.client.name,
    project: entry.project.name,
    task: entry.task,
    time: entry.seconds,
    date: entry.loggedFor
  }));

  const rowSelection = {
    selectedRowKeys,
    onChange: selectedRowKeys => {
      setSelectedRowKeys(selectedRowKeys);
    }
  };

  const components = {
    body: {
      cell: EditableCell
    }
  };

  return (
    <EditableContext.Provider value={form}>
      <Table
        components={components}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
      ></Table>
    </EditableContext.Provider>
  );
}

function Timesheet({ form, timesheetEntryStore, projects }) {
  console.log("Timesheet.render()");
  const { entries } = timesheetEntryStore;

  // function assignEntryToProject(entryId, projectId) {
  //   // updateEntry(entryId, { projectId });
  //   updateTimesheetEntry(entryId, { projectId });
  // }

  const EditableFormTable = observer(Form.create()(EditableTable));
  return <EditableFormTable entries={entries} />;
}

export default observer(Timesheet);
