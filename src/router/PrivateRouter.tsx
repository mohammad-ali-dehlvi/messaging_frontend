import { Navigate, Route, Routes } from "react-router";
import PrivateLayout from "../components/Layouts/PrivateLayout";
import AdminLayout from "../components/Layouts/AdminLayout";
import AdminUsers from "../pages/admin/Users";
import Users from "../pages/private/Users";
import Search from "../pages/private/Search";
import Requests from "../pages/private/Requests";

export default function PrivateRouter() {

  return (
    <>
      <Routes>
        <Route
          path={"admin"}
          element={<AdminLayout prefix={"admin"} />}
        >
          <Route path={"users"} element={<AdminUsers />} />
        </Route>
        <Route element={<PrivateLayout />} >
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<Users />} />
          <Route path="/search" element={<Search />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="*" element={<Navigate to="/users" replace />} />
        </Route>
      </Routes>
    </>
  );
}
