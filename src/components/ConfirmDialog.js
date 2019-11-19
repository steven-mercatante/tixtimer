import React, { Component } from "react";
import styled, { css } from "styled-components";

const ModalInner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  margin: 10px;
  ${props =>
    props.type === "confirm" &&
    css`
      background-color: #1de38b;
    `}
`;

export default class ConfirmDialog extends Component {
  onConfirm = () => {
    this.props.onConfirm();
    this.props.hideModal();
  };

  onCancel = () => {
    const { hideModal, onCancel } = this.props;
    hideModal();
    if (onCancel) {
      onCancel();
    }
  };

  render() {
    const { msg } = this.props;
    return (
      <ModalInner>
        <p>{msg}</p>
        <div>
          <Button type="confirm" onClick={this.onConfirm}>
            YES
          </Button>
          <Button type="cancel" onClick={this.onCancel}>
            No
          </Button>
        </div>
      </ModalInner>
    );
  }
}
