import React from 'react';
import './Pricing.css';

const Pricing = () => {
    return (
        <div className="pricing-container">
            <h1 className="pricing-title">Plans & Pricing</h1>
            <p className="pricing-subtitle">Sign up in less than 30 seconds. Try out our 3-week risk-free trial, upgrade at any time, no questions, no hassle.</p>
            <div className="billing-toggle">
                <button className="toggle-button active">MONTHLY</button>
                <button className="toggle-button">ANNUALLY</button>
            </div>
            <div className="pricing-plans">
                <div className="plan">
                    <h2>Free</h2>
                    <p className="price">$49/mo</p>
                    <ul className="features">
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                    <button className="signup-button">SIGN UP TODAY</button>
                </div>
                <div className="plan">
                    <h2>Small Business</h2>
                    <p className="price">$99/mo</p>
                    <ul className="features">
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                    <button className="signup-button">SIGN UP TODAY</button>
                </div>
                <div className="plan recommended">
                    <h2>Professional</h2>
                    <p className="price">$219/mo</p>
                    <ul className="features">
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                    <button className="signup-button">SIGN UP TODAY</button>
                </div>
                <div className="plan">
                    <h2>Enterprise</h2>
                    <p className="price">$419/mo</p>
                    <ul className="features">
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                    <button className="signup-button">SIGN UP TODAY</button>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
