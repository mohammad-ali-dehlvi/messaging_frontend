import { Navigate, Route, Routes } from "react-router";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import { useEffect } from "react";

export default function PublicRouter() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}
