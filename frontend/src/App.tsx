import { BrowserRouter, Route, Routes } from "react-router-dom";
import Registration from "./pages/registration";
import Home from "./pages/home";
import Room from "./pages/room";
import Notfound from "./pages/notfound";
import Profile from "./pages/profile";
import MyProfile from "./pages/myProfile";
import EditUser from "./pages/editUser";
import SystemProvider from "./context/systemContext";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      <SystemProvider>
        <Routes>
          <Route path="/" element={<Home />} >
            <Route path="room/:id" element={<Room />} />
            <Route path="profile/" element={<MyProfile />} />
            <Route path="profile/update" element={<EditUser />} />
            <Route path="profile/:id" element={<Profile />} />
          </Route>
          <Route path="registration" element={<Registration />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
        <Toaster />
      </SystemProvider>
    </BrowserRouter>
  );
}

export default App;
