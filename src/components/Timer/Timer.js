import React, { useContext } from "react";
import { prettyPrintTime } from "../../utils";
import play from "../../play.svg";
import pause from "../../pause.svg";
import ModalContext from "../../context/ModalContext";
import styled, { css } from "styled-components";
import Button from "../atoms/Button";
import Card from "../atoms/Card";
import ProjectDropdown from "../Project/ProjectDropdown";
import { observer } from "mobx-react";

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

function Timer({ timer, deleteTimer, projects }) {
  const { showModal } = useContext(ModalContext);

  const {
    id,
    task,
    running,
    projectId,
    start,
    stop,
    setTask,
    setProject,
    log,
    totalTime
  } = timer;

  const handleRemove = () => {
    if (totalTime > 0) {
      showModal("CONFIRM", {
        msg:
          "This timer has unlogged time. Are you sure you want to remove it?",
        onConfirm: () => {
          deleteTimer(id);
        }
      });
    } else {
      deleteTimer(id);
    }
  };

  const handleToggle = () => {
    running === true ? stop() : start();
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
          onChange={e => {
            setTask(e.target.value);
          }}
          autoFocus
          placeholder="What are you working on?"
        />
        <Time running={running}>{prettyPrintTime(totalTime)}</Time>
      </div>

      <ActionsContainer>
        <ActionButton type="danger" onClick={handleRemove}>
          X
        </ActionButton>
        <ActionButton type="info" onClick={log}>
          L
        </ActionButton>
      </ActionsContainer>

      <ProjectDropdown
        callback={projectId => setProject(projectId)}
        selected={projectId}
        projects={projects}
      />
    </TimerCard>
  );
}

export default observer(Timer);
