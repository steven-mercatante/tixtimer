// TODO: break things out into modules within a utils package
import groupBy from "lodash/groupBy";
import { format, parseISO } from "date-fns";
import parse from "parse-duration";

// TODO: test & docstring
export const getHistoricTime = (starts, stops) => {
  let historicTime = 0;

  starts.forEach((start, i) => {
    const stop = stops[i];
    if (stop !== undefined) {
      const delta = stops[i] - start;
      historicTime += Math.floor(delta);
    }
  });

  return historicTime;
};

// TODO: test & docstring
export const getTotalTime = (running, starts, stops) => {
  let totalTime = getHistoricTime(starts, stops);

  if (running) {
    const lastStart = starts[starts.length - 1];
    const delta = Math.round(getNow() - lastStart);
    totalTime += delta;
  }

  return totalTime;
};

export const getNow = () => Math.round(Date.now() / 1000);

// TODO: test & docstring
export const getTotalUnloggedTime = timers => {
  return Object.values(timers).reduce((acc, timer) => {
    acc += getTotalTime(timer.running, timer.starts, timer.stops);
    return acc;
  }, 0);
};

// TODO: unit test & docstring
// TODO: should also be able to parse xx:xx:xx format and similar variations
export const parseTime = timeStr => {
  const regex = /^(\d+h)?(\s+)?(\d{1,2}m)?$/gm;
  try {
    const result = regex.exec(timeStr);

    let hours = parseInt(result[1], 10);
    if (isNaN(hours)) {
      hours = 0;
    }

    let minutes = parseInt(result[3], 10);
    if (isNaN(minutes)) {
      minutes = 0;
    }

    const secondsFromHours = hours * 60 * 60;
    const secondsFromMinutes = minutes * 60;

    return secondsFromHours + secondsFromMinutes;
  } catch (err) {
    console.error("error parsing time str");
  }
};

// TODO: test & docstring
export const getTimesheetGroupTotalTime = entries =>
  entries.reduce((acc, entry) => {
    acc += entry.seconds || 0;
    return acc;
  }, 0);

// TODO: should return false on '1.2.3'
const isFloat = x => Number(x) === x && x % 1 !== 0;

/**
 * Given string of time `t`, convert it to seconds.
 * Accepts:
 * - 1h 30m (case & whitespace insensitive)
 * - 1.5
 * - 1
 * - 1h
 * - 5m
 * - 1:30
 */
// TODO: test
export const toSeconds = t => parse(t) / 1000;

/**
 * Given int of seconds `s`, convert it to an array of hours, minutes and seconds
 */
// TODO: test
export const convertSeconds = s => {
  const hours = ~~(s / 3600);
  const minutes = ~~((s % 3600) / 60);
  const seconds = ~~s % 60;

  return [hours, minutes, seconds];
};

// TODO: test
export const convertTime = time => {
  const seconds = toSeconds(time);
  const [hours, minutes] = convertSeconds(seconds);
  return `${hours}h ${minutes}m`;
};

export const groupTimesheetEntries = entries => {
  // Create an object keyed by date
  const groupsDict = groupBy(entries, e =>
    format(parseISO(e.logged_for), "yyyy-MM-dd")
  );

  // Convert object to array, and sort outer groups by date reverse chronologically
  const groupsArray = Object.entries(groupsDict).sort((a, b) =>
    b[0] > a[0] ? 1 : -1
  );

  // Sort the inner entries array chronologically
  groupsArray.forEach(([_, entries]) => {
    entries.sort((a, b) => (a.logged_for > b.logged_for ? 1 : -1));
  });

  return groupsArray;
};

/**
 * Add a leading 0 to a number if it's less than 10
 *
 * @param {int} nb
 */
export const padNumber = nb => ("0" + nb).slice(-2);

export const prettyPrintTime = seconds => {
  const [hours, minutes, _seconds] = convertSeconds(seconds);
  return `${hours}h ${padNumber(minutes)}m ${padNumber(_seconds)}s`;
};

/**
 * Given an array of Sequelize models, convert it into an object
 * keyed by the record ID.
 *
 * @param {Array} arr
 */
export const arrToObj = arr =>
  arr.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});

export function prettyPrintSeconds(seconds) {
  const [hours, minutes, _seconds] = convertSeconds(seconds);
  return `${hours}h ${minutes}m ${_seconds}s`;
}
