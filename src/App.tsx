import "./App.css";
import { initializeFirebase } from "./utils/firebase";
import { BrowserRouter } from "react-router";
import Router from "./router/Router";
import AuthContextProvider from "./context/AuthContext";
import SnackContextProvider from "./context/SnackContext";
import { OpenAPI } from "./client";

initializeFirebase();

OpenAPI.BASE = process.env.REACT_APP_BACKEND_BASE_URL as string;

function App() {
  return (
    <BrowserRouter>
      <SnackContextProvider>
        <AuthContextProvider>
          <Router />
        </AuthContextProvider>
      </SnackContextProvider>
    </BrowserRouter>
  );
}

export default App;
