import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import Chat from "./Chat";

const App = () => (
  <div>
    <Chat />
  </div>
);

ReactDOM.render(<App />, document.getElementById("app"));
