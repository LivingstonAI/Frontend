// src/components/LegodiLogin.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios or use the fetch API directly
import Cookies from 'js-cookie';
import { useEffect } from "react";


export default function LegodiLogin() {

    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    const [submitButton, setSubmitButton] = useState('Submit Button');

    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    async function getCsrfToken() {
        try {
            const response = await fetch(`${baseUrl}/api/csrf_token/`, {
                credentials: 'include', // Include cookies
            });
            const data = await response.json();
            // const csrfToken = data.csrfToken;
            console.log('CSRF Token:', data);

            return data;
            // Store the token (e.g., in state or local storage)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() =>{
        // Call the function to get the CSRF token
        getCsrfToken();
    })

    
    // const csrftoken = getCookie('csrftoken');
    

    const handleSubmit = async (e) => {
        setSubmitButton('Logging in...');
        e.preventDefault();
        try {
            // Get the CSRF token from the cookie (assuming it's named 'csrftoken')
            const csrfToken = Cookies.get('csrftoken'); // Implement the getCookie function
            const csrftoken2 = getCookie('csrftoken');

           

    
            // // Make a POST request to your login endpoint
            // const response = await axios.post(`${baseUrl}/api/login/`, formData, {
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'X-CSRFToken': csrfToken,
            //     },
            // });
            

            // const responseData = response.data;
            // console.log(responseData);
            

            // navigate('/map');
    
            // Store the token (e.g., in local storage or state)
            // Redirect to the desired page (e.g., dashboard)
        } catch (error) {
            // console.error('Login failed:', error.response.data);
            alert('Error occurred. Please try again.');
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
                        <div className="login-form">
                            <div className="title">Login</div>
                            <form onSubmit={handleSubmit}>
                                <div className="input-boxes">
                                    <div className="input-box">
                                        <i className="fas fa-envelope"></i>
                                        <input
                                            type="email"
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
                                        <input type="submit" value="Submit" />
                                    </div>
                                    <div className="text sign-up-text">
                                        <Link to="/regr">
                                            Don't have an account? Signup now
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
