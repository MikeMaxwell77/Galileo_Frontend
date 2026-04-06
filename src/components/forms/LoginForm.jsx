import AuthenticationService from './../../auth/AuthenticationService'
import axios from "axios";
import { useState } from "react";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false); // ✅ Tracks login state

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

    

        try {
            const response = await axios.post(`${AuthenticationService.AUTH_BACKEND_URL}/login`, {
                email,
                password,
            });

            const token = response.data; // ✅ Your API returns only the raw token

            // ✅ Ensure token looks valid (JWT format)
            if (!token || token.split(".").length !== 3) {
                console.error("Invalid token received:", token);
                throw new Error("Invalid token format");
            }

            AuthenticationService.Login(token); // ✅ Store token properly

            setMessage("✅ Login successful! Redirecting...");
            //setTimeout(() => navigate("/"), 1500); // ✅ Redirect after 1.5 sec

        } catch (error) {
            console.error("Login error:", error);
            setMessage("❌ Login failed. Check your credentials.");
        } finally {
            setLoading(false); // ✅ Reset loading state
        }
    };

    return (
        <div>

            <h2>Login </h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
            </form>

            <p>{message}</p>
        </div>
    );
}