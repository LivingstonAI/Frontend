// src/components/LegodiRegistration.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios or use the fetch API directly

export default function LegodiRegistration() {

    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [submitButton, setSubmitButton] = useState('Submit');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitButton('Submitting Details...')
        try {
            // Make a POST request to your backend API endpoint
            const response = await axios.post(`${baseUrl}/api/register/`, formData);
            console.log("User registered successfully:", response.data);
            setSubmitButton('Submit');
            navigate('/legodi-login');
            // Redirect to login page or show success message to the user
        } catch (error) {
            console.error("Registration failed:", error.response.data);
            alert('Error occured. Please make sure you have filled in all the details.')
            setSubmitButton('Submit');
            // Handle error (e.g., display error message to the user)
        }
        setSubmitButton('Submit');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <br /><br /><br />
            <div className="containers">
                <input type="checkbox" id="flip" />
                <div className="forms">
                    <div className="form-content">
                        <div className="signup-form">
                            <div className="title">Signup</div>
                            <form onSubmit={handleSubmit}>
                                <div className="input-boxes">
                                    <div className="input-box">
                                        <i className="fas fa-user"></i>
                                        <input
                                            type="text"
                                            name="username"
                                            placeholder="Enter your name and surname"
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-box">
                                        <i className="fas fa-envelope"></i>
                                        <input
                                            type="text"
                                            name="email"
                                            placeholder="Enter your email"
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-box">
                                        <i className="fas fa-lock"></i>
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Enter your password"
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="button input-box">
                                        <input type="submit" value={submitButton} onClick={handleSubmit} />
                                    </div>
                                    <div className="text sign-up-text">
                                        <Link to="/legodi-login">
                                            Already have an account? Login here
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
