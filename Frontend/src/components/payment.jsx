import { useRef, useEffect } from "react";
import React from "react";
import Header from "./header";
import SideNavs from "./side_navs";
// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
    PayPalScriptProvider,
    PayPalHostedFieldsProvider,
    PayPalHostedField,
    usePayPalHostedFields,
} from "@paypal/react-paypal-js";

const SubmitPayment = () => {
    // Here declare the variable containing the hostedField instance
    const hostedFields = usePayPalHostedFields();

    const submitHandler = () => {
        if (typeof hostedFields.submit !== "function") return; // validate that `submit()` exists before using it
        hostedFields
            .submit({
                // The full name as shown in the card and billing address
                cardholderName: "John Wick",
            })
            .then((order) => {
                fetch(
                    "/your-server-side-integration-endpoint/capture-payment-info"
                )
                    .then((response) => response.json())
                    .then((data) => {
                        // Inside the data you can find all the information related to the payment
                    })
                    .catch((err) => {
                        // Handle any error
                    });
            });
    };

    return <button onClick={submitHandler}>Pay</button>;
};

export default function Payment() {


    const initialOptions = {
        clientId: "test",
        currency: "USD",
        intent: "capture",
    };


    return (
        <div>
             <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <div className="main-body-info"></div>
                <div className="payment-page-div" >
                    <h5>Payment Page</h5>
                    <div id="paypal" >
                    <PayPalScriptProvider
            options={{
                clientId: "AYcvBxrr7Xt1Cw2Ma6CboshNlZmBhBkp9Ru1NjSMjXS1_wyL87EueXVL10y2njaLgiRB0l--iBIh_dqe",
                dataClientToken: "your-data-client-token",
                components: 'hosted-fields',
            }}
        >
            {/* <PayPalHostedFieldsProvider 
                createOrder={() => {
                    // Here define the call to create and order
                    return fetch(
                        "/your-server-side-integration-endpoint/orders"
                    )
                        .then((response) => response.json())
                        .then((order) => order.id)
                        .catch((err) => {
                            // Handle any error
                        });
                }}
            >
                <PayPalHostedField
                    id="card-number"
                    hostedFieldType="number"
                    options={{ selector: "#card-number" }}
                />
                <PayPalHostedField
                    id="cvv"
                    hostedFieldType="cvv"
                    options={{ selector: "#cvv" }}
                />
                <PayPalHostedField
                    id="expiration-date"
                    hostedFieldType="expirationDate"
                    options={{
                        selector: "#expiration-date",
                        placeholder: "MM/YY",
                    }}
                />
                <SubmitPayment />
            </PayPalHostedFieldsProvider> */}
        </PayPalScriptProvider>
                    </div>
                </div>
            </div>
        </div>    
    )
}