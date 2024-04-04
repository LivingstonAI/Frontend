import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import Logo from '../images/legodi_logo.jpg';


export default function OrderTab() {

    const navigate = useNavigate();

    const HomePageNav = () => {
        navigate('/legodi');
    }

    return (
        <div>

            <nav class="navbar navbar-light bg-light">
  <div class="container-fluid upper-nav-legodi">
    <a class="navbar-brand" href="#">
      <img src={Logo} alt="" width="30" height="24" class="d-inline-block align-text-top" />
        Legodi Future Technologies
    </a>
        <h6 onClick={HomePageNav} className="legodi-home-page-link">Home</h6>
  </div>
</nav>
            
            <br /><br /><br /><br />
            <div className="book-order-div">
                <h2>Book an Order</h2>
            </div>
            
        </div>
    )

}

