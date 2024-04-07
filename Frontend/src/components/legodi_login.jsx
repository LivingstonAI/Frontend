import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import Logo from '../images/legodi_logo.jpg';
import { Link } from "react-router-dom";


export default function LegodiLogin() {
    return (
        <div><br /><br /><br />
            <div className="container">
    <input type="checkbox" id="flip" />
    
    <div className="forms">
        <div className="form-content">
          
        <div className="login-form">
            <div className="title">Login</div>
          <form action="#">
            <div className="input-boxes">
              <div className="input-box">
                <i className="fas fa-envelope"></i>
                <input type="text" placeholder="Enter your email" required />
              </div>
              <div className="input-box">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Enter your password" required />
              </div>
              <div className="text"><a href="#">Forgot password?</a></div>
              <div className="button input-box">
                <input type="submit" value="Sumbit" />
              </div>
              <div className="text sign-up-text">
                <Link to="/regr">Don't have an account? Sigup now</Link>
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