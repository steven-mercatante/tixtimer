import React, { useContext } from "react";
import ReactModal from "react-modal";
import ModalContext from "../context/ModalContext";
import ConfirmDialog from "../components/ConfirmDialog";

ReactModal.setAppElement("#root");

const MODAL_COMPONENTS = {
  CONFIRM: ConfirmDialog
};

export default () => {
  const { modalType, modalProps, hideModal } = useContext(ModalContext);

  const isOpen = modalType !== null && modalType !== undefined;
  const ModalClass = MODAL_COMPONENTS[modalType];

  if (!isOpen) return null;

  return (
    <div>
      <ReactModal
        isOpen={isOpen}
        style={{
          content: {
            top: "10%",
            width: "500px",
            height: "200px",
            margin: "0 auto"
          }
        }}
      >
        <ModalClass hideModal={hideModal} {...modalProps} />
      </ReactModal>
    </div>
  );
};
