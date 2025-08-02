import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmailToken } from "../api/authApi"; // ajusta el path si es necesario

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");
    console.log("toke"+ token)
    useEffect(() => {
        const verify = async () => {
            if (token) {
                const result = await verifyEmailToken(token);

                navigate('/login', {
                    state: {
                        alert: {
                            type: result.success ? 'success' : 'error',
                            message: result.message,
                        },
                    },
                });
            } else {
                navigate('/login', {
                    state: {
                        alert: {
                            type: 'error',
                            message: 'Token no válido',
                        },
                    },
                });
            }
        };

        verify();
    }, [token, navigate]);

    return null;
};

export default VerifyEmail;
