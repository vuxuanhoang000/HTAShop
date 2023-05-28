const AUTH_TOKEN_STORE_KEY = "token";
/* Auth */
export const removeAuthToken = () => {
    return localStorage.removeItem(AUTH_TOKEN_STORE_KEY);
};

export const setAuthToken = (token) => {
    return localStorage.setItem(AUTH_TOKEN_STORE_KEY, token);
};

export const getAuthToken = () => {
    return localStorage.getItem(AUTH_TOKEN_STORE_KEY);
};

export const hasAuthToken = () => {
    return !!getAuthToken();
};

/* Global */
export const setItemLocalStorage = (name, value) => {
    return localStorage.setItem(name, value);
};

export const removeItemLocalStorage = (name) => {
    return localStorage.removeItem(name);
};
