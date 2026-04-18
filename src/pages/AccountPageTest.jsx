import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthenticationService from "../auth/AuthenticationService";

const API_BASE_URL = "http://localhost:8080";

export default function AccountPage() {
    const [account, setAccount] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        loadAccount();
    }, []);

    const loadAccount = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/account/me`, {
                headers: AuthenticationService.getAuthHeader(),
            });
            setAccount(res.data);
        } catch (err) {
            console.error("LOAD FAILED:", err);
            if (err.response?.status === 401) navigate("/login");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`${API_BASE_URL}/account/me`, account, {
                headers: AuthenticationService.getAuthHeader(),
            });
            alert("System Core Updated!");
            setEditMode(false);
        } catch (err) {
            console.error("UPDATE FAILED:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Terminate Node? This will wipe all cosmic data.")) return;
        try {
            await axios.delete(`${API_BASE_URL}/account/me`, {
                headers: AuthenticationService.getAuthHeader(),
            });
            AuthenticationService.logout();
            navigate("/login");
        } catch (err) {
            console.error("DELETE FAILED:", err);
        }
    };

    // Dynamic Search Integration
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length > 2) {
                try {
                    const res = await axios.get(`${API_BASE_URL}/accounts/search`, {
                        params: { email: searchQuery },
                        headers: AuthenticationService.getAuthHeader(),
                    });
                    setSearchResults(res.data);
                } catch (err) { console.error("Search failed:", err); }
            } else { setSearchResults([]); }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    if (!account) return <div className="loading-screen">Synchronizing with Galileo...</div>;

    return (
        <div className="page-root">
            <main className="page-main">
                <div className="page-content">
                    <header className="mb-5">
                        <h1 className="font-headline fw-bold page-title mb-1">Command Center</h1>
                        <p className="page-subtitle mb-0">Identity Node: {account.id}</p>
                    </header>

                    <div className="row g-4">
                        {/* Profile Section */}
                        <div className="col-12 col-md-8">
                            <div className="bento-card d-flex flex-column flex-md-row align-items-center gap-4">
                                <div className="profile-avatar">
                                    <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${account.email}`} alt="Avatar" />
                                    <button className="avatar-edit-btn" onClick={() => setEditMode(!editMode)}>
                                        <span className="material-symbols-outlined">{editMode ? 'close' : 'edit'}</span>
                                    </button>
                                </div>
                                <div className="flex-grow-1">
                                    {!editMode ? (
                                        <>
                                            <h2 className="font-headline fw-bold mb-0">{account.email.split('@')[0]}</h2>
                                            <p className="profile-meta">{account.email} • Verified Observer</p>
                                        </>
                                    ) : (
                                        <form onSubmit={handleUpdate} className="d-flex flex-column gap-2">
                                            <input 
                                                className="galileo-input form-control" 
                                                value={account.email} 
                                                onChange={(e) => setAccount({...account, email: e.target.value})}
                                            />
                                            <button type="submit" className="btn-warp w-auto" disabled={loading}>
                                                {loading ? "Saving..." : "Update Pulse"}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Search / Constellation Section */}
                        <div className="col-12">
                            <div className="bento-card">
                                <h3 className="font-headline fw-bold mb-3" style={{ fontSize: "1.2rem" }}>Expand Your Constellation</h3>
                                <div className="constellation-input-wrap mb-4">
                                    <input 
                                        className="constellation-input" 
                                        type="text" 
                                        placeholder="Search by callsign..." 
                                        value={searchQuery} 
                                        onChange={(e) => setSearchQuery(e.target.value)} 
                                    />
                                </div>
                                <div className="d-flex gap-4 overflow-auto">
                                    {searchResults.map((obs) => (
                                        <div key={obs.id} className="observer-avatar">
                                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${obs.email}`} alt="node" />
                                            <span>{obs.email.split('@')[0]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="col-12 mt-2">
                            <div className="danger-zone d-flex justify-content-between align-items-center">
                                <p className="danger-text mb-0">Historical Data Purge</p>
                                <div className="d-flex gap-2">
                                    <button className="btn-sign-out" onClick={() => { AuthenticationService.Logout(); navigate("/"); }}>Sign Out</button>
                                    <button className="btn-delete-node" onClick={handleDelete}>Delete Node</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}