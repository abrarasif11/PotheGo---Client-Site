import { loadStripe } from "@stripe/stripe-js";
import React from "react";
const stripePromise = loadStripe("pk_test_6pRNASCoBOKtIshFeQd4XMUh");
const Payment = () => {
  return (
    <Elements stripe={stripePromise}>
     
    </Elements>
  );
};

export default Payment;
