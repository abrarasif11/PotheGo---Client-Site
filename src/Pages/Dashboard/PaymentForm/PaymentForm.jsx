import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React from "react";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handSubmit = (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      return;
    }
    
  };
  return (
    <form onSubmit={handSubmit}>
      <CardElement>
        <button type="submit" disabled={!stripe}>
          Pay For Parcel
        </button>
      </CardElement>
    </form>
  );
};

export default PaymentForm;
