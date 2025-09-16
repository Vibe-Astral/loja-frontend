import React from "react";
import ReactDOM from "react-dom/client";
import Routes from "./Routes";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const rootElement = document.getElementById("root") as HTMLElement;

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes />
      </AuthProvider>
    </ErrorBoundary>

  </React.StrictMode >
  );
}

