import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import Logo from '../images/legodi_logo.jpg';
import { Link } from "react-router-dom";

export default function LegodiRegistration() {
    return (
        <div><br /><br /><br />
            <div className="containers">
    <input type="checkbox" id="flip" />
    
    <div className="forms">
        <div className="form-content">
          
        <div className="signup-form">
          <div className="title">Signup</div>
        <form action="#">
            <div className="input-boxes">
              <div className="input-box">
                <i className="fas fa-user"></i>
                <input type="text" placeholder="Enter your name" required />
              </div>
              <div className="input-box">
                <i className="fas fa-envelope"></i>
                <input type="text" placeholder="Enter your email" required />
              </div>
              <div className="input-box">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Enter your password" required />
              </div>
              <div className="button input-box">
                <input type="submit" value="Sumbit" />
              </div>
              <div className="text sign-up-text">
                  <Link to="/legodi-login">Already have an account? Login here</Link>
              </div>
            </div>
      </form>
    </div>
    </div>
    </div>
  </div>
  </div>
    )
}