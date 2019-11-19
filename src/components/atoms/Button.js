import styled, { css } from "styled-components";

export default styled.button`
  padding: 0 15px;
  border: none;

  ${({ type }) =>
    type === "info" &&
    css`
      background-color: #33c3f0;
    `}

  ${({ type }) =>
    type === "success" &&
    css`
      background-color: #1de38b;
    `}

  ${({ type }) =>
    type === "danger" &&
    css`
      background-color: #dc3545;
      color: #fff;
    `}
`;
