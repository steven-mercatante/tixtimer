import React from "react";
import Header from "./components/Header";
// TODO: modal BG should obscure entire app
import ModalRoot from "./components/ModalRoot";
import { ModalProvider } from "./context/ModalContext";
import Sidebar from "./components/Sidebar";
import { Router } from "@reach/router";
import Timesheet from "./components/Timesheet/Timesheet";
import { ClientProvider } from "./context/ClientContext";
import ClientList from "./components/Client/ClientList";
import ProjectList from "./components/Project/ProjectList";
import TimerList from "./components/Timer/TimerList";
import { TimerProvider } from "./context/TimerContext";
import styled from "styled-components";
import { ToastContainer } from "react-toastify";
import "./css/normalize.css";
import "./css/skeleton.css";
import "./css/App.css";
import "react-toastify/dist/ReactToastify.css";

import AppStore from "./stores/appStore";

const appStore = AppStore.create();
console.log("addClient:", appStore.clientStore.addClient);

// const store = AppStore.create({
//   clients: ClientStore.create([
//     { id: "1", name: "Client 1" },
//     { id: "2", name: "Client 2" }
//   ]),
//   projects: [{ client: 1, name: "Project 1", id: "1" }]
// });

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
        <ClientProvider>
          <TimerProvider>
            <Header />
            <Router>
              <ClientList
                path="/clients"
                clients={appStore.clientStore.clients}
                addClient={appStore.clientStore.addClient}
              />
              <ProjectList
                path="/projects"
                clients={appStore.clientStore.clients}
                projects={appStore.projectStore.projects}
                addProject={appStore.projectStore.addProject}
              />
              <TimerList path="/timers" timerStore={appStore.timerStore} />
              <Timesheet path="/timesheets" />
            </Router>
          </TimerProvider>
        </ClientProvider>
      </Content>
    </ContentContainer>
  </ModalProvider>
);
