import { jwtDecode } from "jwt-decode";

export const TOKEN_KEY = 'token';

export const saveToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
}

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
}

// export const isAuthenticated = () => {
//     const token = getToken();
//     return token !== null && token !== undefined;
// };

export const decodeToken = (token) => {
    if (!token) return null;

    try {
        const decode = jwtDecode(token); // Esto decodifica y retorna el payload del token
        return decode;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};