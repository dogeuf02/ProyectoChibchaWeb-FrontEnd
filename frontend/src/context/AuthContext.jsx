// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(localStorage.getItem("authenticated") === "true");
  const [role, setRole] = useState(localStorage.getItem("userRole"));

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated, role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
