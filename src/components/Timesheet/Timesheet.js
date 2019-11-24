import React, { useState } from "react";
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
import useSelectItems from "../../hooks/useSelectItems";
import BulkActions from "../BulkActions";
import { inflect } from "inflection";
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
import useTimesheet from "../../hooks/useTimesheet";

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

const getEntryIds = entries => Object.values(entries).map(entry => entry.id);

const Pagination = ({ page, nextPage, prevPage }) => (
  <React.Fragment>
    <p>Current page: {page}</p>
    <button onClick={prevPage}>Prev page</button>
    <button onClick={nextPage}>Next page</button>
  </React.Fragment>
);

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

export default function({ projects }) {
  const {
    entries,
    createEntry,
    updateEntry,
    deleteEntry,
    deleteEntries,
    page,
    nextPage,
    prevPage,
    searchTerm,
    setSearchTerm,
    searchTermTotalTime,
    setSearchTermTotalTime
  } = useTimesheet();

  const {
    selectedItems,
    unselectAllItems,
    toggleSelectItem,
    areItemsSelected,
    selectMany,
    unselectMany
  } = useSelectItems(client => client.id);
  // console.log("selectedItems:", selectedItems);

  const groupedEntries = groupTimesheetEntries(entries);
  const entryIds = getEntryIds(entries);

  function assignEntryToProject(entryId, projectId) {
    updateEntry(entryId, { projectId });
    updateTimesheetEntry(entryId, { projectId });
  }

  return (
    <Timesheet>
      <LogTimeForm projects={projects} createEntry={createEntry} />

      <Pagination page={page} nextPage={nextPage} prevPage={prevPage} />

      <DateSummary
        label="Summary for today"
        forDate={format(new Date(), "yyyy-MM-dd")}
      />
      <DetailedSummary
        label="Summary for this week"
        startDate={_startOfThisWeek}
        endDate={_endOfThisWeek}
      />
      <DetailedSummary
        label="Summary for last week"
        startDate={_startOfLastWeek}
        endDate={_endOfLastWeek}
      />
      {/* <Summary
        label="Summary for this month"
        startDate={_startOfMonth}
        endDate={_endOfMonth}
      /> */}
      {/* <Summary
        label="Summary for last month"
        startDate={_startOfLastMonth}
        endDate={_endOfLastMonth}
      /> */}

      <Search
        setSearchTerm={setSearchTerm}
        setSearchTermTotalTime={setSearchTermTotalTime}
      />

      {searchTerm !== "" && (
        <React.Fragment>
          <h3>Results for "{searchTerm}"</h3>
          <p>
            Total time: {prettyPrintSeconds(searchTermTotalTime)} (
            {(searchTermTotalTime / 3600).toFixed(2)})
          </p>
        </React.Fragment>
      )}

      <input
        type="checkbox"
        onClick={() => {
          if (areItemsSelected(entryIds)) {
            unselectMany(entryIds);
          } else {
            selectMany(entryIds);
          }
        }}
        checked={areItemsSelected(entryIds)}
        onChange={event =>
          console.log("You clicked a Timesheet checkbox!", event)
        }
      />

      {selectedItems.length > 0 && (
        <BulkActions
          deleteMsgFunc={() =>
            `Are you sure you want to delete ${selectedItems.length} ${inflect(
              "entry",
              selectedItems.length
            )}?`
          }
          onConfirmCallback={() => {
            deleteEntries(selectedItems);
            unselectAllItems();
          }}
        />
      )}

      {groupedEntries.map(([key, entries]) => {
        const entryIds = Object.values(entries).map(entry => entry.id);
        // TODO: possible to not re-render each TimesheetGroup if its children haven't changed or been selected? useMemo?
        return (
          <TimesheetGroup
            key={key}
            label={key}
            totalTime={getTimesheetGroupTotalTime(entries)}
            selectChildren={() => {
              if (areItemsSelected(entryIds)) {
                unselectMany(entryIds);
              } else {
                selectMany(entryIds);
              }
            }}
            entriesAreSelected={areItemsSelected(entryIds)}
          >
            {entries.map(entry => (
              <GroupRow
                key={entry.id}
                entry={entry}
                deleteEntry={deleteEntry}
                updateEntry={updateEntry}
                onChangeTask={task => updateEntry(entry.id, { task })}
                onChangeTime={time =>
                  updateEntry(entry.id, { seconds: toSeconds(time) })
                }
                assignEntryToProject={assignEntryToProject}
                isSelected={selectedItems.includes(entry.id)}
                handleToggle={() => toggleSelectItem(entry.id)}
                projects={projects}
              />
            ))}
          </TimesheetGroup>
        );
      })}
      <Pagination page={page} nextPage={nextPage} prevPage={prevPage} />
    </Timesheet>
  );
}
