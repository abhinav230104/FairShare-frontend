import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);
  };
  
  const updateUserProfile = async (newName) => {
    await api.patch("/auth/updateProfile",{ name: newName });
    
    const updatedUser = { ...user, name: newName };
    setUser(updatedUser);

    // 2. Update localStorage so the change persists on refresh
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const signup = async (name, email, password) => {
    await api.post("/auth/signup", { name, email, password });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUserProfile}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
