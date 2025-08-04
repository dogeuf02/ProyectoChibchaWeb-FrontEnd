import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../api/authApi";
import { useGlobalAlert } from "../context/AlertContext";
import { TOKEN_KEY, saveToken, decodeToken } from "../utils/authToken";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { showAlert } = useGlobalAlert();

  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [authenticated, setAuthenticated] = useState(() => localStorage.getItem("authenticated") === "true");

  const [userId, setUserId] = useState(null);
  const [specificId, setSpecificId] = useState(null);
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null);
  const [userData, setUserData] = useState(null);

  // Actualiza localStorage cada vez que el token cambie
  useEffect(() => {
    if (token) {
      saveToken(token);
      const decoded = decodeToken(token);
      console.log(decoded)
      if (decoded) {
        setUserData(decoded);
        setUserId(decoded.idUsuario);
        setSpecificId(decoded.idRelacionado);
        setRole(decoded.rol);
        setEmail(decoded.sub);
      }
    }
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
      console.error("Error en login:", error);
      return { success: false, message: "Fallo inesperado durante el login." };
    }
  };

  const logout = () => {
    setAuthenticated(false);
    setToken(null);
    setUserId(null);
    setSpecificId(null);
    setRole(null);
    setEmail(null);
    setUserData(null);

    localStorage.clear();
    showAlert("Sesión cerrada", "success");
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
