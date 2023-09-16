import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";


export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  // ... other state variables

  // State for form validation
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [finalData, setFinalData] = useState([]);
  const baseURL = 'https://backend-production-c0ab.up.railway.app';
  

  // ... other validation errors

  const checkEmailExists = async (email) => {
    try {
        const response = await fetch(`${baseURL}/check_email/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `email=${encodeURIComponent(email)}`,
        });
        const data = await response.json();
        return data.exists;
    } catch (error) {
        console.error("Error checking email:", error);
        return false;
    }
    };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error states
    setUsernameError("");
    setEmailError("");
    setPasswordError(""); // Add this line
    // ... reset other error states
    setConfirmPasswordError("");

    // Validate inputs
    if (!username) {
        setUsernameError("Username is required.");
        return;
    }
    if (!email) {
        setEmailError("Email is required.");
        return;
    }
    if (!password) {
        setPasswordError("Password is required.");
        return;
    }
    if (password.length < 10) {
        setPasswordError("Password must be at least 12 characters long.");
        return;
    }
    if (!/[A-Z]/.test(password)) {
        setPasswordError("Password must include at least one capital letter.");
        return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        setPasswordError("Password must include at least one special character.");
        return;
    }
    if (password !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match.");
        return;
      }
    const isEmailTaken = await checkEmailExists(email);
    if (isEmailTaken) {
        setEmailError("This email is already taken.");
        return;
    }
      // Perform registration logic
      setFinalData([username, email, password]);
      const userData = {
        username: username,
        email: email,
        password: password
    };
    try {
        const response = await fetch(`${baseURL}/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.status === 201) {
            console.log("Registration successful");
            localStorage.setItem('registeredEmail', email);
            navigate('/tell_us_more'); // Navigate to the next page
        } else {
            const responseData = await response.json();
            console.log("Registration failed:", responseData);
            console.log(responseData['username'])
            if (responseData['username']) {
                setUsernameError(responseData['username']);
            }
        }
    } catch (error) {
        console.error("Error during registration:", error);
    }
    //   navigate('/tell_us_more')

      
    };
    useEffect(() => {
    }, [finalData]);

  
    return (
        <div>
        <div className='register-div'>
            <h3 className='register-title'>Register</h3>
            <div className='user-register-div'>
                <label>Username:</label>
                <input type="text" className="form-control" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                {usernameError && <p className="error-message">{usernameError}</p>}
                <label>Email:</label>
                <input type="email" className="form-control" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} />
                {emailError && <p className="error-message">{emailError}</p>}
                <label>Password:</label>
                <input type="password" className="form-control" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && <p className="error-message">{passwordError}</p>}
                
                <label>Confirm Password:</label>
                <input type="password" className="form-control" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPasswordError && (
          <p className="error-message">{confirmPasswordError}</p>
        )}
            </div>
            <button className="btn btn-primary register-button" onClick={handleSubmit}>Register</button>
            <Link to="/login" className="login-here">Already have an account? Login here</Link>
        </div>
        </div>
    );
}
