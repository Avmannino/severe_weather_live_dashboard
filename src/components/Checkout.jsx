import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import StripeCheckout from './StripeCheckout';
import './Checkout.css';

const Checkout = () => {
  const location = useLocation();
  const product = location.state?.product || { name: 'Product', price: 100 };
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <form className="checkout-form">
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={handleInputChange(setFirstName)}
            required
          />
        </label>
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={handleInputChange(setLastName)}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={handleInputChange(setEmail)}
            required
          />
        </label>
        <label>
          Billing Address
          <input
            type="text"
            value={billingAddress}
            onChange={handleInputChange(setBillingAddress)}
            required
          />
        </label>
        <label>
          Shipping Address
          <input
            type="text"
            value={shippingAddress}
            onChange={handleInputChange(setShippingAddress)}
            required
          />
        </label>
      </form>
      <StripeCheckout product={product} />
    </div>
  );
};

export default Checkout;
