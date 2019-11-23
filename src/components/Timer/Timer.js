import React, { useContext } from "react";
import { getTotalTime, prettyPrintTime } from "../../utils";
import play from "../../play.svg";
import pause from "../../pause.svg";
import ModalContext from "../../context/ModalContext";
import styled, { css } from "styled-components";
import Button from "../atoms/Button";
import Card from "../atoms/Card";
import ProjectDropdown from "../Project/ProjectDropdown";

const TimerCard = styled(Card)`
  width: 500px;
  display: flex;
  justify-content: space-between;
  opacity: 0.75;

  ${props =>
    props.running &&
    css`
      opacity: 1;
    `}
`;

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content: space-between;
`;

const ActionButton = styled(Button)`
  width: 10%;
  height: 200%;
`;

const Time = styled.p`
  color: #8795a1;
  font-size: 2.5rem;
  margin: 0;

  ${props =>
    props.running &&
    css`
      font-size: 3rem;
      color: #1de38b;
    `}
`;

const ToggleButton = styled.img`
  margin-right: 10px;
  cursor: pointer;
`;

export default function({
  timer,
  startTimer,
  stopTimer,
  removeTimer,
  logTime,
  setTimerTask,
  assignToProject
}) {
  const { showModal } = useContext(ModalContext);

  const { id, task, starts, stops, running, projectId } = timer;
  const totalTime = getTotalTime(running, starts, stops);

  const handleUpdateTask = e => {
    setTimerTask(id, e.target.value);
  };

  const handleLog = () => {
    // Call totalTime so we don't get a drifted value of this.totalTime // TODO needed??
    const totalTime = getTotalTime(running, starts, stops);
    logTime(id, task, totalTime, projectId);
  };

  const handleRemove = () => {
    if (totalTime > 0) {
      showModal("CONFIRM", {
        msg:
          "This timer has unlogged time. Are you sure you want to remove it?",
        onConfirm: () => removeTimer(id)
      });
    } else {
      removeTimer(id);
    }
  };

  const handleToggle = () => {
    running === true ? stopTimer(id) : startTimer(id);
  };

  return (
    <TimerCard running={running}>
      <ToggleButton
        src={running ? pause : play}
        width="50"
        height="50"
        onClick={handleToggle}
        alt={running ? "pause" : "play"}
      />

      <div>
        <input
          type="text"
          value={task}
          onChange={handleUpdateTask}
          autoFocus
          placeholder="What are you working on?"
        />
        <Time running={running}>{prettyPrintTime(totalTime)}</Time>
      </div>

      <ActionsContainer>
        <ActionButton type="danger" onClick={handleRemove}>
          X
        </ActionButton>
        <ActionButton
          type="info"
          onClick={handleLog}
          disabled={totalTime === 0}
        >
          L
        </ActionButton>
      </ActionsContainer>

      <ProjectDropdown
        callback={projectId => assignToProject(id, projectId)}
        selected={projectId}
      />
    </TimerCard>
  );
}
