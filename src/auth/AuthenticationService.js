import axios from "axios"

const AUTH_BACKEND_URL = `${import.meta.env.VITE_GALILEO_BACKEND_API_ROUTE}/auth`;

// HEAVILY inspired by the auth service in the demo project
const AuthenticationService = {
    AUTH_BACKEND_URL,
    Register : async (email, password) => {
        try {
            const response = await axios.post(`${AUTH_BACKEND_URL}/register`, {
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
    Login : async (email, password) => {
        try {
            const response = await axios.post(`${AUTH_BACKEND_URL}/login`, {
                email: email,
                password: password,
            });

            const token = response.data; // adjust based on backend

            if (!token) {
                throw new Error("No token received");
            }

            localStorage.setItem("AuthToken", token);

            return token;
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            throw error;
        }
    },

    Logout : () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");

        if(!confirmLogout) return;

        localStorage.removeItem("AuthToken");

    },

    getAuthHeader: () => {
        const token = localStorage.getItem("AuthToken");
        return token ? { Authorization: `Bearer ${token}` } : {};
    },

    
    getToken: () => {
        return localStorage.getItem("AuthToken");
    },
    getUserID: () => {
        if (!AuthenticationService.isAuthenticated()) return -1;
        
        const token = localStorage.getItem("AuthToken");
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.id;

        return userId;
    },
    clearToken: () => {
        localStorage.removeItem("AuthToken");
    },

    // ✅ Check if a token exists and is valid
    isAuthenticated: () => {
        const token = localStorage.getItem("AuthToken");
    if (!token || token.split(".").length !== 3) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      const expiryTime = payload.exp * 1000;
      if (Date.now() >= expiryTime) {
          AuthenticationService.Logout();
        return false;
      }
      return true;
    } catch (error) {
      console.error("Invalid token:", error);
      AuthenticationService.Logout();
      return false;
    }
  },

  

}

export default AuthenticationService;