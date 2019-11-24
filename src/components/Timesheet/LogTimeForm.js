import React, { useState } from "react";
import { toSeconds } from "../../utils";
import Button from "../atoms/Button";
import ProjectDropdown from "../Project/ProjectDropdown";

export default function LogTimeForm({ projects, createEntry }) {
  const [task, setTask] = useState("");
  const [time, setTime] = useState("");
  const [projectId, setProjectId] = useState();

  const handleSubmit = e => {
    // TODO: show toast notification
    // TODO: needs validation
    e.preventDefault();
    if (!task || !time) {
      console.error("task and time are required");
      return;
    }
    const seconds = toSeconds(time);
    createEntry(task, seconds, projectId);
    setTask("");
    setTime("");
    setProjectId();
  };

  // TODO: isn't there a nicer way to do inputs using hooks?
  return (
    <form onSubmit={handleSubmit}>
      <label>Task</label>
      <input
        type="text"
        value={task}
        placeholder="Programming"
        onChange={e => setTask(e.target.value)}
      />
      <label>Time</label>
      <input
        type="text"
        value={time}
        placeholder="1h 30m"
        onChange={e => setTime(e.target.value)}
      />
      <ProjectDropdown projects={projects} callback={id => setProjectId(id)} />
      <Button type="success">SUBMIT</Button>
    </form>
  );
}
