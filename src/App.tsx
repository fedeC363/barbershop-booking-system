import { Route, Routes } from "react-router-dom";

import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyAppointments from "./pages/MyAppointments";
import Register from "./pages/Register";

function App() {
  return (
    <Routes>
      <Route element={<Home />} path="/" />
      <Route element={<Login />} path="/login" />
      <Route element={<Register />} path="/register" />
      <Route element={<MyAppointments />} path="/my-appointments" />
      <Route element={<Admin />} path="/admin" />
    </Routes>
  );
}

export default App;
