import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from '../images/legodi_logo.jpg';
import { Map, GoogleApiWrapper } from 'google-maps-react';


const GeofenceMap = () =>  {

    const navigate = useNavigate();

    const HomePageNav = () => {
        navigate('/legodi');
    };


    const mapStyles = {
    width: '100%',
    height: '75%',
    };

    return (
        <div>
            <div className="map">
            <nav class="navbar navbar-light bg-light">
            <div class="container-fluid upper-nav-legodi">
                <a class="navbar-brand" href="#">
                <img src={Logo} alt="" width="30" height="24" class="d-inline-block align-text-top" />
                    Legodi Future Technologies
                </a>
                    <h6 onClick={HomePageNav} className="legodi-home-page-link">Home</h6>
            </div>
            </nav>
            
            <br /><br />

            <Map
        google={window.google} // Make sure the Google Maps API is loaded
        zoom={14}
        style={mapStyles}
        initialCenter={{ lat: -25.7522, lng: 28.2245 }} // Set your desired initial center
      />
    </div>

            </div>
        
    )
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyDdboULTlv0q_ypduRZDGuxSP8OXKl-zHE',
  })(GeofenceMap);