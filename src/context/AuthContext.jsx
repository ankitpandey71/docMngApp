import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  const login = async (mobile, otp) => {
    const res = await axios.post(
      "https://apis.allsoft.co/api/documentManagement/validateOTP",
      { mobile_number: mobile, otp }
    );
    console.log("Login response:", res);
    if (res.data?.data.token) {
      setToken(res.data.data.token);
      setIsAuthenticated(true);
      localStorage.setItem("token", res.data.data.token);
    }
    return res.data;
  };

  const logout = () => {
    setToken("");
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);