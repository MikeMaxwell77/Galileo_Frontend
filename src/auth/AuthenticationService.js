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
    },

    // ✅ Check if a token exists and is valid
    isAuthenticated: () => {
    const token = localStorage.getItem("token");
    if (!token || token.split(".").length !== 3) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      const expiryTime = payload.exp * 1000;
      if (Date.now() >= expiryTime) {
        AuthService.logout();
        return false;
      }
      return true;
    } catch (error) {
      console.error("Invalid token:", error);
      AuthService.logout();
      return false;
    }
  },

  

}

export default AuthenticationService;