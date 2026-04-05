import axios from "axios"

const AUTH_BACKEND_URL = `${import.meta.env.VITE_GALILEO_BACKEND_API_ROUTE}/auth`;

// HEAVILY inspired by the auth service in the demo project
const AuthenticationService = {
    AUTH_BACKEND_URL,
    Register : async (username, email, password) => {
        try {
            const response = await axios.post(`${AUTH_BACKEND_URL}/register`, {
                username,
                email,
                password,
            });
            return response.data;
        } catch (error) {
            console.error("Registration error:", error.response?.data || error.message);
            throw error;
        }
    },

    Login : (token) => {
        if (!token) {
            console.error("Invalid AuthToken received:", token);
            return;
        }
        localStorage.setItem("AuthToken", token);
    },

    Logout : () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");

        if(!confirmLogout) return;

        localStorage.removeItem("AuthToken");

    },

    getAuthHeader: () => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    },

    
    getToken: () => {
        return localStorage.getItem("token");
    },

    
    clearToken: () => {
        localStorage.removeItem("token");
    }

}

export default AuthenticationService;