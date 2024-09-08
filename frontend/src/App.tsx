import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Room from "./pages/room";
import Notfound from "./pages/notfound";
import Profile from "./pages/profile";
import MyProfile from "./pages/myProfile";
import EditUser from "./pages/editUser";
import SystemProvider from "./context/systemContext";
import { Toaster } from "./components/ui/toaster";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import AuthProvider from "./context/authContext";
import Register from "./pages/register";
import Login from "./pages/login";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SystemProvider>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>}>
              <Route path="room/:id" element={<Room />} />
              <Route path="profile/" element={<MyProfile />} />
              <Route path="profile/update" element={<EditUser />} />
              <Route path="profile/:id" element={<Profile />} />
            </Route>

            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            <Route path="*" element={<Notfound />} />
          </Routes>
          <Toaster />
        </SystemProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
