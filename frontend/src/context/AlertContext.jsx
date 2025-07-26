import { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info", // info | success | warning | error
  });

  const showAlert = (message, severity = "info") => {
    setAlert({ open: true, message, severity });
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert, closeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

// Hook para usar fácilmente
export const useGlobalAlert = () => useContext(AlertContext);
