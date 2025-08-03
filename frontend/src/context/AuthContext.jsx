import { createContext, useContext, useState, useEffect } from "react";
import { auth } from '../api/authApi';
import { useGlobalAlert } from "../context/AlertContext";
import { TOKEN_KEY, isAuthenticated } from "../utils/authToken";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { showAlert } = useGlobalAlert();

  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY) || null;
  })

  const [authenticated, setAuthenticated] = useState(() => {
    return localStorage.getItem("authenticated") === "true";
  });

  useEffect(() => {
    localStorage.setItem(TOKEN_KEY, token);
  })

  useEffect(() => {
    localStorage.setItem("authenticated", authenticated);
  }, [authenticated]);

  const login = async (email, password) => {
    try {
      const credentials = {
        correo: email,
        contrasena: password
      };

      const response = await auth(credentials);

      if (response.autenticado) {
        setToken(response.token);
        setAuthenticated(isAuthenticated());

        return { success: true };
      } else {
        return { success: false, message: response.mensaje };
      }
    } catch (error) {
      console.error("Error en login:", error);
      return { success: false, message: "Fallo inesperado durante el login." };
    }
  };


  const logout = () => {
    setAuthenticated(false);
    localStorage.clear()
    localStorage.removeItem("token");
    localStorage.removeItem("authenticated");
    localStorage.removeItem("userRole");
    showAlert("Logged out", "success")
  };

  return (
    <AuthContext.Provider value={{ authenticated, setToken, setAuthenticated, login, logout }}>
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
