import React, { useState } from "react";

const ModalContext = React.createContext();

const ModalProvider = ({ children }) => {
  const [modalType, setModalType] = useState(null);
  const [modalProps, setModalProps] = useState({});

  const showModal = (type, props) => {
    setModalType(type);
    setModalProps(props);
  };

  const hideModal = () => {
    setModalType(null);
    setModalProps({});
  };

  return (
    <ModalContext.Provider
      value={{ modalType, modalProps, hideModal, showModal }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export { ModalProvider };
export default ModalContext;
