import React from "react";
import Header from "./components/Header";
// TODO: modal BG should obscure entire app
import ModalRoot from "./components/ModalRoot";
import { ModalProvider } from "./context/ModalContext";
import Sidebar from "./components/Sidebar";
import { Router } from "@reach/router";
import Timesheet from "./components/Timesheet/Timesheet";
import ClientList from "./components/Client/ClientList";
import ProjectList from "./components/Project/ProjectList";
import TimerList from "./components/Timer/TimerList";
import styled from "styled-components";
import { ToastContainer } from "react-toastify";
import "./css/normalize.css";
import "./css/skeleton.css";
import "./css/App.css";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/antd.css";

import AppStore from "./stores/appStore";

const appStore = AppStore.create();
const { clientStore, projectStore, timerStore, timesheetEntryStore } = appStore;

const ContentContainer = styled.div`
  position: absolute;
  left: 190px;
  right: 0;
`;

const Content = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: 70px;
`;

export default () => (
  <ModalProvider>
    <ModalRoot />
    <ToastContainer hideProgressBar={true} />
    <Sidebar />
    <ContentContainer>
      <Content>
        <Header timers={timerStore.timers} addTimer={timerStore.addTimer} />
        <Router>
          <ClientList path="/clients" clientStore={clientStore} />
          <ProjectList
            path="/projects"
            clients={clientStore.clients}
            projectStore={projectStore}
          />
          <TimerList
            path="/timers"
            projects={projectStore.projects}
            timerStore={timerStore}
          />
          <Timesheet
            path="/timesheets"
            timesheetEntryStore={timesheetEntryStore}
            projects={projectStore.projects}
          />
        </Router>
      </Content>
    </ContentContainer>
  </ModalProvider>
);
