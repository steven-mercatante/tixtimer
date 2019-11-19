// TODO: separate things into their own modules

const ITEMS_PER_PAGE = 50;

export const getClients = () => {};

export const createClient = name => {};

export const getProjects = () => {};

export const createProject = (clientId, name) => {};

export const deleteProject = id => {};

export const deleteProjects = ids => {};

export const getTimers = () => {};

export const createTimer = (id, now) => {};

export const deleteClient = id => {};

export const deleteClients = ids => {};

export const deleteTimer = id => {};

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
