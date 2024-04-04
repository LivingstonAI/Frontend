import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import Logo from '../images/legodi_logo.jpg';


export default function OrderTab() {

    const navigate = useNavigate();

    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [chosenProduct, setChosenProduct] = useState('');
    const [submitButton, setSubmitButton] = useState('Submit Details');

    const manageFirstName = (event) => {
        setFirstName(event.target.value)
    }

    const manageLastName = (event) => {
        setLastName(event.target.value);
    }

    const manageEmail = (event) => {
        setUserEmail(event.target.value);
    }

    const manageChosenProduct = (event) => {
        setChosenProduct(event.target.value)
    }


    const HomePageNav = () => {
        navigate('/legodi');
    }

    const submitDetails = async () => {
        // Check if any field is empty
        setSubmitButton('Submitting Details...')
        if (firstName === '' || lastName === '' || userEmail === '' || chosenProduct === '') {
            alert('Please fill in all details before sending a message.');
            setSubmitButton('Submit Details');
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/book-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email: userEmail,
                    interested_product: chosenProduct,
                }),
            });

            if (response.ok) {
                alert("Order booked successfully!");
                // Clear form fields
                setFirstName('');
                setLastName('');
                setUserEmail('');
                setChosenProduct('');
                setSubmitButton('Submit Details')
            } else {
                throw new Error("Failed to book order");
            }
        } catch (error) {
            setSubmitButton('Submit Details')
            console.error("Error booking order:", error);
            alert("Failed to book order. Please try again later.");
            
        }
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
            
            <br /><br />
            <div className="book-order-div">
                <h2>Book an Order</h2><br />
                <label>First Name:</label>
                <input type="text" className="form-control" onChange={manageFirstName} /><br />
                <label>Last Name:</label>
                <input type="text" className="form-control" onChange={manageLastName} /><br />
                <label>Which of our products are you interested in?</label>
                <select class="form-select" aria-label="Default select example" onChange={manageChosenProduct}>
                    <option value=""></option>
                    <option value="One">One</option>
                    <option value="Two">Two</option>
                    <option value="Three">Three</option>
                    <option value="Four">Four</option>
                </select><br />
                <label>Email:</label>
                <input type="email" className="form-control" onChange={manageEmail}/><br />
                <button className="btn btn-primary" onClick={submitDetails}>{submitButton}</button>
            </div>
            <br /><br />
        </div>
    )

}

