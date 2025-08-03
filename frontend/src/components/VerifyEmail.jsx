import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmailToken } from "../api/authApi"; // Asegúrate que esta sea la función correcta
import { useGlobalAlert } from "../context/AlertContext";

const VerifyEmail = () => {

    const { showAlert } = useGlobalAlert();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");
    const hasRun = useRef(false); // <-- evita ejecutar el efecto dos veces

    useEffect(() => {
        const verify = async () => {
            if (token) {
                const result = await verifyEmailToken(token);
                console.log("result from comp:", result);
                showAlert(result.message, result.success ? "success" : "error");

            }
            navigate('/login');
        };

        if (!hasRun.current) {
            hasRun.current = true;
            verify();
        }
    }, [token, navigate]);

    return null;
};

export default VerifyEmail;
