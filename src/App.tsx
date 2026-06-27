import { Navigate, Route, Routes } from "react-router-dom";

import Admin from "./pages/Admin";
import BookAppointment from "./pages/BookAppointment";
import Login from "./pages/Login";
import MyAppointments from "./pages/MyAppointments";
import Register from "./pages/Register";

function App() {
  return (
    <Routes>
      <Route element={<Navigate replace to="/login" />} path="/" />
      <Route element={<Login />} path="/login" />
      <Route element={<Register />} path="/register" />
      <Route element={<MyAppointments />} path="/my-appointments" />
      <Route element={<BookAppointment />} path="/book-appointment" />
      <Route element={<Admin />} path="/admin" />
    </Routes>
  );
}

export default App;
