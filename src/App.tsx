import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { NavBar } from "./components/NavBar";
import { DiagramEditor } from "./components/DiagramEditor";
import { store } from "./store";

function App() {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <div className="flex flex-col h-screen">
          <NavBar />
          <div className="flex flex-row flex-1">
            <DiagramEditor />
          </div>
        </div>
      </ChakraProvider>
    </Provider>
  );
}

export default App;
