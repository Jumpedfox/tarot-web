import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { ChakraProvider, Spinner, Center } from "@chakra-ui/react";
import "./index.css";
import App from "./App";
import store, { persistor } from "./redux/store.ts";
import { system } from "./theme";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container missing in index.html");
}

const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider value={system}>
        <PersistGate
          loading={
            <Center h="100vh">
              <Spinner size="xl" color="white" />
            </Center>
          }
          persistor={persistor}
        >
          <App />
        </PersistGate>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
);
