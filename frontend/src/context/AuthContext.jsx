import { createContext, useContext, useState, useEffect } from "react";
import { auth } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(() => {
    return localStorage.getItem("authenticated") === "true";
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem("userRole") || null;
  });

  // Efecto para mantener sincronizado con localStorage
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
        setAuthenticated(true);
        setRole(response.rol);

        // Guardar también el id si lo necesitas en localStorage
        localStorage.setItem("userId", response.id);

        return { success: true };
      } else {
        return { success: false, message: response.mensaje || "Credenciales incorrectas" };
      }
    } catch (error) {
      return { success: false, message: "Error del servidor" };
    }
  };

  const logout = () => {
    setAuthenticated(false);
    setRole(null);
    localStorage.removeItem("authenticated");
    localStorage.removeItem("userRole");
  };

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated, role, setRole , login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);