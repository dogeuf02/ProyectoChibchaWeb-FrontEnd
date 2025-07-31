import { createContext, useContext, useState, useEffect } from "react";
import { auth } from '../api/authApi';
import { useGlobalAlert } from "../context/AlertContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { showAlert } = useGlobalAlert();

  const [userId, setUserId] = useState(() => {
    return localStorage.getItem("userId") || null;
  })

  const [roleId, setRoleId] = useState(() =>{
    return localStorage.getItem("roleId") || null;
  })

  const [authenticated, setAuthenticated] = useState(() => {
    return localStorage.getItem("authenticated") === "true";
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem("userRole") || null;
  });

  useEffect(() => {
    localStorage.setItem("userId", userId);
  }, [userId])

  useEffect(() => {
    localStorage.setItem("roleId", roleId);
  }, [roleId])

  useEffect(() => {
    localStorage.setItem("authenticated", authenticated);
  }, [authenticated]);

  useEffect(() => {
    if (role) {
      localStorage.setItem("userRole", role);
    } else {
      localStorage.removeItem("userRole");
    }
  }, [role]);

  const login = async (email, password) => {
    try {
      const credentials = {
        correo: email,
        contrasena: password
      };

      const response = await auth(credentials);

      if (response.autenticado) {
        setUserId(response.id);
        setRoleId(response.idRol);
        setAuthenticated(true);
        setRole(response.rol);

 

        return { success: true };
      } else {
        return { success: false, message: response.mensaje};
      }
    } catch (error) {
      return { success: false, message: error.mensaje};
    }
  };

  const logout = () => {
    setAuthenticated(false);
    setRole(null);
    localStorage.clear()
    localStorage.removeItem("authenticated");
    localStorage.removeItem("userRole");
    showAlert("Logged out", "success")
  };

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated, role, setRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
