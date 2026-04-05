import { useState } from "react";
import AuthenticationService from './../../auth/AuthenticationService'


export default function RegisterForm() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false); // ✅ Tracks registration state
    //const navigate = useNavigate(); // For navigation after registration

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage(""); // ✅ Clear previous messages
        setLoading(true); // ✅ Show loading state

        try {
            await AuthenticationService.Register(username, email, password);
            setMessage("✅ Registration successful! Redirecting to login...");
            //setTimeout(() => navigate("/login"), 1500); // ✅ Redirect after 1.5 sec
        } catch (error) {
            setMessage("❌ Registration failed. Email may already be in use.");
            console.error("Registration failed:", error.response?.data || error.message);
        } finally {
            setLoading(false); // ✅ Reset loading state
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input type="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
            </form>
            <p>{message}</p>
        </div>
    );
}