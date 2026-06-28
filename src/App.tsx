import { Navigate, Route, Routes } from "react-router-dom";

import AdminRoute from "./components/AdminRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Admin from "./pages/Admin";
import BookAppointment from "./pages/BookAppointment";
import Login from "./pages/Login";
import MyAppointments from "./pages/MyAppointments";
import Register from "./pages/Register";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Navigate replace to="/login" />} path="/" />
        <Route element={<Login />} path="/login" />
        <Route element={<Register />} path="/register" />
        <Route element={<MyAppointments />} path="/my-appointments" />
        <Route element={<BookAppointment />} path="/book-appointment" />
        <Route
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
          path="/admin"
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
