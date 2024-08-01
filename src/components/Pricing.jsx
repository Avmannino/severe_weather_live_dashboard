import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Pricing.css';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const monthlyPrices = {
    smallBusiness: 499,
    professional: 1499,
    enterprise: 3999,
  };

  const annualPrices = {
    smallBusiness: Math.ceil(monthlyPrices.smallBusiness * 10.5),
    professional: Math.ceil(monthlyPrices.professional * 10.5),
    enterprise: Math.ceil(monthlyPrices.enterprise * 10.5),
  };

  const prices = billingCycle === 'monthly' ? monthlyPrices : annualPrices;

  const handleGetStarted = (product) => {
    if (isAuthenticated) {
      navigate('/checkout', { state: { product } });
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="pricing-container ">
      <h1 className="pricing-title">Plans & Pricing</h1>
      <p className="pricing-subtitle">Sign up in less than 30 seconds! Try out our 3-week risk-free trial, upgrade at any time, no questions, no hassle.</p>
      <div className="billing-toggle">
        <button
          className={`toggle-button ${billingCycle === 'monthly' ? 'active' : ''}`}
          onClick={() => setBillingCycle('monthly')}
        >
          MONTHLY
        </button>
        <button
          className={`toggle-button ${billingCycle === 'annually' ? 'active' : ''}`}
          onClick={() => setBillingCycle('annually')}
        >
          ANNUALLY
        </button>
      </div>
      <div className="pricing-plans animate__animated animate__slideInRight animate__delay-0s">
        <div
          className={`plan ${selectedPlan === 'basic' ? 'selected' : ''}`}
          onClick={() => setSelectedPlan('basic')}
        >
          <h2>Basic</h2>
          <p className="price">FREE</p>
          <p className='everything'>Free access to all essential features.</p>
          <ul className="features-basic">
            <li>✔ Real-time weather alerts and notifications</li>
            <li>✔ Basic radar imagery and weather maps</li>
            <li>✔ Access to community support and online resources</li>
          </ul>
          <button className="signup-button" onClick={() => handleGetStarted({ name: 'Basic', price: 0 })}>Get Started</button>
        </div>
        <div
          className={`plan ${selectedPlan === 'personal' ? 'selected' : ''}`}
          onClick={() => setSelectedPlan('personal')}
        >
          <h2>Personal</h2>
          <p className="price">
            ${Math.floor(prices.smallBusiness / 100)}
            <span className="cents">{billingCycle === 'monthly' ? String(prices.smallBusiness).split('.')[1] || '00' : '00'}</span>
            /{billingCycle === 'monthly' ? 'mo' : 'yr'}
          </p>
          <p className='everything'>Everything in the Basic Plan, plus:</p>
          <ul className="features-personal">
            <li>✔ Real-time weather alerts and notifications.</li>
            <li>✔ Basic radar imagery and weather maps.</li>
            <li>✔ Detailed daily and hourly weather forecasts.</li>
            <li>✔ Email support with a 24-hour response time.</li>
          </ul>
          <button className="signup-button" onClick={() => handleGetStarted({ name: 'Personal', price: prices.smallBusiness })}>Get Started</button>
        </div>
        <div
          className={`plan ${selectedPlan === 'professional' ? 'selected' : ''}`}
          onClick={() => setSelectedPlan('professional')}
        >
          <h2>Pro</h2>
          <p className="price">
            ${Math.floor(prices.professional / 100)}
            <span className="cents">{billingCycle === 'monthly' ? String(prices.professional).split('.')[1] || '00' : '00'}</span>
            /{billingCycle === 'monthly' ? 'mo' : 'yr'}
          </p>
          <p className='everything'>Everything in the Small Business Plan, plus:</p>
          <ul className="features-pro">
            <li>✔ Enhanced radar imagery and weather maps.</li>
            <li>✔ Access to advanced weather models and predictions.</li>
            <li></li>
            <li></li>
          </ul>
          <button className="signup-button" onClick={() => handleGetStarted({ name: 'Pro', price: prices.professional })}>Get Started</button>
        </div>
        <div
          className={`plan ${selectedPlan === 'enterprise' ? 'selected' : ''}`}
          onClick={() => setSelectedPlan('enterprise')}
        >
          <h2>Enterprise</h2>
          <p className="price">
            ${Math.floor(prices.enterprise / 100)}
            <span className="cents">{billingCycle === 'monthly' ? String(prices.enterprise).split('.')[1] || '00' : '00'}</span>
            /{billingCycle === 'monthly' ? 'mo' : 'yr'}
          </p>
          <p className='everything'>Everything in the Professional Plan, plus:</p>
          <ul className="features-ent">
            <li>✔ Enterprise-level data security and compliance.</li>
            <li>✔ 24/7 phone support with a 1-hour response time.</li>
            <li>✔ On-site training and consultation services.</li>
          </ul>
          <button className="signup-button" onClick={() => handleGetStarted({ name: 'Enterprise', price: prices.enterprise })}>Get Started</button>
        </div>
      </div>
      <div className="contact-us">
        <p>Questions? <a href="/contact-us">Contact Us</a></p>
      </div>
    </div>
  );
};

export default Pricing;
