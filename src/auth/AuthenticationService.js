import axios from "axios"

const AUTH_BACKEND_URL = `${import.meta.env.VITE_GALILEO_BACKEND_API_ROUTE}/auth`;

// HEAVILY inspired by the auth service in the demo project
const AuthenticationService = {
    Register : async (email, password, role) => {
        try {
            const response = await axios.post(`${API_URL}/register`, {
                email,
                password,
                role,
            });
            return response.data;
        } catch (error) {
            console.error("Registration error:", error.response?.data || error.message);
            throw error;
        }
    },

    Login : (token) => {
        if (!token || token.split(".").length !== 3) {
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

    getUserRole : () => {
        const token = localStorage.getItem("token");
        if (!token || token.split(".").length !== 3) return "GUEST";

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.role || "GUEST";
        } catch (error) {
            console.error("Error decoding token:", error);
            return "GUEST";
        }
    },

    getAuthHeader: () => {
        const token = localStorage.getItem("token");
        return token && token.split(".").length === 3 ? { Authorization: `Bearer ${token}` } : {};
    },

    
    getToken: () => {
        return localStorage.getItem("token");
    },

    
    clearToken: () => {
        localStorage.removeItem("token");
    }

}

export default AuthenticationService;