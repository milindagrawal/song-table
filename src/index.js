import React, { StrictMode } from "react";
import ReactDOM from "react-dom";

import SongTable from "./SongTable";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <SongTable />
  </StrictMode>,
  rootElement
);
