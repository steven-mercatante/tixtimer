import { useEffect, useReducer, useState } from "react";
import uuid from "uuid/v4";
import {
  getTimesheetEntries,
  createTimesheetEntry,
  deleteTimesheetEntry,
  updateTimesheetEntry
} from "../api";
import { toast } from "react-toastify";
import { inflect } from "inflection";

function reducer(state, action) {
  console.log("--- useTimesheet action:", action);
  switch (action.type) {
    case "load_entries": {
      return action.entries;
    }

    case "create_entry": {
      const { id, task, seconds, loggedFor, projectId } = action;
      return { ...state, [id]: { id, task, seconds, loggedFor, projectId } };
    }

    case "update_entry": {
      const { id, data } = action;
      return { ...state, [id]: { ...state[id], ...data } };
    }

    case "delete_entries": {
      return Object.entries(state).reduce((acc, [id, entry]) => {
        if (!action.ids.includes(id)) {
          acc[id] = entry;
        }
        return acc;
      }, {});
    }

    default:
      throw Error();
  }
}

export default function useTimesheet() {
  const [entries, dispatch] = useReducer(reducer, {});
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermTotalTime, setSearchTermTotalTime] = useState(0);

  useEffect(() => {
    getTimesheetEntries(page, searchTerm).then(resp => {
      dispatch({ type: "load_entries", entries: resp });
    });
  }, [page, searchTerm]);

  async function createEntry(task, seconds, projectId) {
    const id = uuid();
    const loggedFor = Date.now();
    await createTimesheetEntry(id, task, seconds, loggedFor, projectId);
    dispatch({ type: "create_entry", id, task, seconds, loggedFor, projectId });
    toast.success("Timesheet entry added.");
  }

  function updateEntry(id, data) {
    dispatch({ type: "update_entry", id, data });
    updateTimesheetEntry(id, data);
  }

  async function deleteEntries(ids) {
    await deleteTimesheetEntry(ids);
    dispatch({ type: "delete_entries", ids });
    toast.success(`${ids.length} ${inflect("entry", ids.length)} deleted.`);
  }

  function nextPage() {
    setPage(page + 1);
  }

  function prevPage() {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  return {
    entries,
    createEntry,
    updateEntry,
    deleteEntries,
    page,
    nextPage,
    prevPage,
    searchTerm,
    setSearchTerm,
    searchTermTotalTime,
    setSearchTermTotalTime
  };
}
