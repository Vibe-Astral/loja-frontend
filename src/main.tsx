import React from "react";
import ReactDOM from "react-dom/client";
import Routes from "./Routes";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes />
      </AuthProvider>
    </ErrorBoundary>

  </React.StrictMode >
);
