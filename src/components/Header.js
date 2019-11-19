import React, { useContext } from "react";
import { prettyPrintTime, getTotalUnloggedTime } from "../utils";
import { Link, navigate } from "@reach/router";
import TimerContext from "../context/TimerContext";
import styled from "styled-components";

const Header = styled.header`
  display: flex;
  background-color: #b4bac1;
  position: fixed;
  width: 100%;
  top: 0;
  left: 190px;
  padding: 4px;
  z-index: 100;
`;

const Button = styled.button`
  background-color: #1de38b;
`;

export default () => {
  const { timers, addTimer } = useContext(TimerContext);

  const handleAddTimer = () => {
    navigate("/timers");
    addTimer();
  };

  return (
    <Header>
      <span>
        Unlogged time:{" "}
        <Link to="/timers">
          <span>{prettyPrintTime(getTotalUnloggedTime(timers))}</span>
        </Link>
      </span>
      <Button onClick={handleAddTimer}>+ Timer</Button>
    </Header>
  );
};
