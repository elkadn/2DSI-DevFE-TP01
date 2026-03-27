// src/App.tsx

import Login from "./features/auth/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/ProjectDetail";
import LoginMUI from "./features/auth/LoginMUI";
import LoginBS from "./features/auth/LoginBS";

export default function App() {
  return (
    <Routes>
      {/* <Route path="/login" element={<LoginMUI />} /> */}
      {/* <Route path="/login" element={<Login />} /> */}

      <Route path="/login" element={<LoginBS />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:id"
        element={
          <ProtectedRoute>
            <ProjectDetail />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
