import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {v4 as uuidv4} from 'uuid';
import Cookies from 'js-cookie';


export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [finalData, setFinalData] = useState([]);
    const [error, setError] = useState("");
    const uniqueID = uuidv4();
    const baseURL = 'https://backend-production-c0ab.up.railway.app'

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Reset error states
        setEmailError("");
        setPasswordError("");
        setError("");

        // Validate inputs
        if (!email) {
            setEmailError("Email is required.");
            return;
        }
        if (!password) {
            setPasswordError("Password is required.");
            return;
        }

        // Perform login logic
        setFinalData([email, password]);
        const loginData = {
            email: email,
            password: password
        };
        try {
            const response = await fetch(`${baseURL}/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });
    
            if (response.status === 200) {
                const { email } = await response.json();
                Cookies.set('email', email);
                navigate(`/personal_info`);
                // Handle successful login, e.g., redirect or display a message
            } else {
                // const responseData = await response.json();
                setError("Invalid Email or Password");
                // Handle login failure, e.g., display an error message
            }
        } catch (error) {
            // do nothing
        }
    };

    useEffect(() => {
    }, [finalData]);


    return (
        <div>
            <div className="login-div">
                <h3 className="login-title">Login</h3>
                {error && <p className="error-message">{error}</p>}
                <div className="user-login-div">
                    <label>Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {emailError && <p className="error-message">{emailError}</p>}
                    
                    <label>Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordError && <p className="error-message">{passwordError}</p>}
                </div>
                <button className="btn btn-primary login-button" onClick={handleSubmit}>Login</button>
                <Link to="/register" className="register-here">Don't have an account? Register here</Link>
            </div>
        </div>
    );
}
