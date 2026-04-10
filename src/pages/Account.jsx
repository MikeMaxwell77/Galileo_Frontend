// check log in token
/*
from is authenicated in auth service, if not authenticated, redirect to login page
*/
// get account info
/*
we make another funciton that gets the user info from the backend, and then we display it on the account page
*/
// display account info
// allow user to update account info
// post account info

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthenticationService from "../auth/AuthenticationService"; // ✅ Import AuthService
//import { API_BASE_URL } from '../api';

export default function UpdateAccount() {
  let navigate = useNavigate();
  const { id } = useParams();

  const [account, setAccount] = useState({
    username: "",
    password: "",
    privacy: false,
  });

  const { username, password, privacy } = account;

  const onInputChange = (e) => {
    setAccount({ ...account, [e.target.name]: e.target.value });
  };

  const onCheckChange = (e) => {
    setAccount({ ...account, [e.target.name]: e.target.checked });
  }

  useEffect(() => {
    loadAccount();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/account/${id}`, account, {
        headers: AuthenticationService.getAuthHeader(), // ✅ Include JWT token
      });
      navigate("/");
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  const deleteAccount = async (id) => {
    await axios.delete(`${API_BASE_URL}/account/${id}`, {
      headers: AuthenticationService.getAuthHeader(),
    });
    loadUsers();
  };

  const loadAccount = async () => {
    try {
      const result = await axios.get(`${API_BASE_URL}/account/${id}`, {
        headers: AuthService.getAuthHeader(), // ✅ Include JWT token
      });
      setAccount(result.data);
    } catch (error) {
      console.error("Error loading account:", error);
    }
  };

  return (
    <div className="custom-container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Edit Account</h2>
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="Username" className="form-label">Username</label>
              <input type="text" className="form-control" placeholder="Enter your username"
                name="username" value={username} onChange={onInputChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="Password" className="form-label">Password</label>
              <input type="password" className="form-control" placeholder="Enter your password"
                name="password" value={password} onChange={onInputChange} required />
            </div>
            <div className="mb-3">
              <div className="form-check form-switch">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  name="privacy" 
                  id="privacySwitch"
                  checked={privacy} 
                  onChange={onCheckChange} 
                />
                <label className="form-check-label" htmlFor="privacySwitch">
                  {privacy ? "Public Account" : "Private Account"}
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-outline-primary">Submit</button>
            <button type="delete" className="btn btn-outline-danger" onClick={() => deleteAccount(id)}>Delete Account</button>
            <Link className="btn btn-outline-danger mx-2" to="/">Cancel</Link>
          </form>
        </div>
      </div>
    </div>
  );
}