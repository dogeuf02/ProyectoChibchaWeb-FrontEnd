export const TOKEN_KEY = 'token';

export const svaeToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
}

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
}   

export const isAuthenticated = () => {
    const token = getToken();
    return token !== null && token !== undefined;
};

export const decodeToken = (token) => {
    if (!token) {
        return null;
    }

    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};
