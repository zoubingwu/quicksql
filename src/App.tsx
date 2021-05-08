import React from "react";
import { Provider } from "react-redux";
import { NavBar } from "./components/NavBar";
import { DiagramEditor } from "./components/DiagramEditor";
import { store } from "./store";
import { CodeArea } from "./components/CodeArea";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

function App() {
  return (
    <Provider store={store}>
      <div className="flex flex-col h-screen overflow-hidden">
        <NavBar />
        <div className="flex flex-row flex-1 h-full">
          <DiagramEditor />
          <CodeArea />
        </div>
      </div>
    </Provider>
  );
}

export default App;
