import React from "react";
import { Provider } from "react-redux";
import { NavBar } from "./components/NavBar";
import { DiagramEditor } from "./components/DiagramEditor";
import { store } from "./store";
import { CodeArea } from "./components/CodeArea";

function App() {
  return (
    <Provider store={store}>
      <div className="flex flex-col h-screen">
        <NavBar />
        <div className="flex flex-row flex-1">
          <DiagramEditor />
          <CodeArea />
        </div>
      </div>
    </Provider>
  );
}

export default App;
