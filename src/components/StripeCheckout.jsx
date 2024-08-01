import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import './StripeCheckout.css'; // Import the CSS file

const stripePromise = loadStripe('your_stripe_publishable_key');

const CheckoutForm = ({ product }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('http://localhost:5000/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_name: product.name,
        amount: product.price,
      }),
    });

    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="StripeCheckoutForm">
      <CardElement className="StripeElement" />
      <button type="submit" disabled={!stripe || !elements}>
        Pay
      </button>
    </form>
  );
};

const StripeCheckout = ({ product }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm product={product} />
  </Elements>
);

export default StripeCheckout;
