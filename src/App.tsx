import React from "react";
import { NavBar } from "./components/NavBar";
import { CodeArea } from "./components/CodeArea";
import { DiagramEditor } from "./components/DiagramEditor";

function App() {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex flex-row flex-1">
        <DiagramEditor />
        <CodeArea />
      </div>
    </div>
  );
}

export default App;
