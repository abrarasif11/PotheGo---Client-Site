import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../../Shared/Loader/Loader";
import useAuth from "../../../hooks/useAuth";

const PaymentForm = () => {
  const { id } = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { isPending, data: parcelInfo = {} } = useQuery({
    queryKey: ["parcels", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`parcels/${id}`);
      return res.data;
    },
  });

  if (isPending) {
    return <Loader />;
  }

  console.log(parcelInfo);

  const amount = parcelInfo.price;
  const amountInCents = amount * 100;
  console.log(amountInCents);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
      console.log("error", error);
    } else {
      setError("");
      console.log("Payment Method", paymentMethod);

      // Create Payment intent //
      const res = await axiosSecure.post("create-payment-intent", {
        amountInCents,
        id,
      });
      const clientSecret = res.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.displayName,
            email: user.email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        setError("");
        if (result.paymentIntent.status === "succeeded") {
          console.log("Payment Success!!!");
          console.log(result);

          // Create Payment History //
          const paymentRes = await axiosSecure.post("/payments", {
            parcelId: id,
            email: user?.email,
            amount,
            transactionId: result.paymentIntent.id,
            paymentMethod: result.paymentIntent.payment_method_types,
          });

          if (paymentRes.data.insertedId) {
            console.log("Payment Successful");
          }
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-4">
      <CardElement className="border p-2 rounded" />
      <button
        type="submit"
        disabled={!stripe}
        className="mt-4 bg-[#FA2A3B] text-white px-4 py-2 rounded hover:bg-[#E02032]"
      >
        Pay ৳{amount}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </form>
  );
};

export default PaymentForm;
