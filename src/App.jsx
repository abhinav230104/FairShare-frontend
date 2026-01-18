import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Room from "./pages/Room";
import GuestRoom from "./pages/GuestRoom";
import Landing from "./pages/Landing";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Landing />} />
          <Route path="/rooms/:roomId" element={<Room />} />
          <Route path="/guest/:roomId" element={<GuestRoom />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
