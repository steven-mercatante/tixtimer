import React from "react";
import { Link } from "@reach/router";
import styled from "styled-components";

const Sidebar = styled.div`
  background-color: #202024;
  height: 100vh;
  width: 150px;
  position: fixed;
  top: 0;
  left: 0;
  padding: 2rem;
  z-index: 100;
`;

const StyledLink = styled(Link)`
  display: block;
  position: relative;
  color: #fff;
  padding: 0.5rem;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  margin-bottom: 4px;

  :hover {
    background-color: #0f65d9;
  }
`;

export default () => (
  <Sidebar>
    <ul>
      <li>
        <StyledLink to="/clients">Clients</StyledLink>
      </li>
      <li>
        <StyledLink to="/projects">Projects</StyledLink>
      </li>
      <li>
        <StyledLink to="/timers">Timers</StyledLink>
      </li>
      <li>
        <StyledLink to="/timesheets">Timersheets</StyledLink>
      </li>
    </ul>
  </Sidebar>
);
