// TODO: separate things into their own modules
import axios from "axios";

const ITEMS_PER_PAGE = 50;

// TODO: fetch token from cookie
const getHeaders = () => ({
  Authorization: "Token 5200a233be168d88abce47b302815f901d3da15e"
});
const apiRoot = "http://127.0.0.1:8000/";

const _get = url =>
  axios
    .get(`${apiRoot}${url}`, { headers: getHeaders() })
    .then(resp => resp.data)
    .catch(err => console.log(`Error GET ${url}:`, err));

const _post = (url, data) =>
  axios
    .post(`${apiRoot}${url}`, data, { headers: getHeaders() })
    .then(resp => resp.data)
    .catch(err => console.log(`Error GET ${url}:`, err));

const _delete = url => {
  axios
    .delete(`${apiRoot}${url}`, { headers: getHeaders() })
    .then(resp => {
      return resp.data;
    })
    .catch(err => console.log(`Error GET ${url}:`, err));
};

export const getClients = () => _get("clients");

export const createClient = name => _post("clients/", { name });

export const getProjects = () => _get("projects");

export const createProject = (clientId, name) => {};

export const deleteProject = id => _delete(`projects/${id}/`);

export const deleteProjects = ids => {
  ids.forEach(id => {
    deleteProject(id);
  });
};

export const getTimers = () => _get("timers");

export const createTimer = (id, now) => {};

export const deleteClient = id => _delete(`clients/${id}/`);

export const deleteClients = ids => {
  ids.forEach(id => {
    deleteClient(id);
  });
};

export const deleteTimer = id => _delete(`timers/${id}/`);

export const updateTimer = (id, data) => {};

export const getTimesheetEntries = async (page = 1, searchTerm = "") => {};

export const createTimesheetEntry = (
  id,
  task,
  seconds,
  loggedFor,
  projectId
) => {};

export const updateTimesheetEntry = (id, data) => {};

export const deleteTimesheetEntry = id => {};

// TODO: use parameterized query
export const getSummary = (start, end) => {};

// TODO: use parameterized query
export const getDetailedSummary = async (start, end) => {};

// TODO: use parameterized query
export const getSummaryForDate = async date => {};

// TODO: use parameterized query
export const getTotalTimeForSearchTerm = async searchTerm => {};
