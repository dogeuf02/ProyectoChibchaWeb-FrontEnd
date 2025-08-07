import { createContext, useContext, useState, useEffect } from "react";
import { apiLogout, auth } from "../api/authApi";
import { useGlobalAlert } from "../context/AlertContext";
import { TOKEN_KEY, saveToken, decodeToken } from "../utils/authToken";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { showAlert } = useGlobalAlert();

  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [authenticated, setAuthenticated] = useState(() => localStorage.getItem("authenticated") === "true");
  const [authLoading, setAuthLoading] = useState(true);

  const [userId, setUserId] = useState(null);
  const [specificId, setSpecificId] = useState(null);
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (token) {
      saveToken(token);
      const decoded = decodeToken(token);
      if (decoded) {
        setUserData(decoded);
        setUserId(decoded.idUsuario);
        setSpecificId(decoded.idRelacionado);
        setRole(decoded.rol);
        setEmail(decoded.sub);
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    }
    setAuthLoading(false);
  }, [token]);


  useEffect(() => {
    localStorage.setItem("authenticated", authenticated);
  }, [authenticated]);

  const login = async (email, password, captchaToken) => {
    try {
      const response = await auth({ correo: email, contrasena: password, captchaToken: captchaToken });

      if (response.autenticado) {
        setToken(response.token);
        setAuthenticated(true); // ya se decodifica más arriba
        return { success: true };
      } else {
        return { success: false, message: response.mensaje };
      }
    } catch (error) {
      return { success: false, message: "Fallo inesperado durante el login." };
    }
  };

  const logout = async () => {
    if (!token) {
      return;
    }
    try {
      const result = await apiLogout(token);
      if (result) {
        showAlert("Sesión cerrada", "success");
      }

    } catch (error) {
      showAlert("Error al cerrar sesión", "error");
    }
    setAuthenticated(false);
    setToken(null);
    setUserId(null);
    setSpecificId(null);
    setRole(null);
    setEmail(null);
    setUserData(null);
    setAuthLoading(false);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{
      authenticated,
      token,
      login,
      logout,
      userId,
      specificId,
      role,
      email,
      userData,
      authLoading
    }}>
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
