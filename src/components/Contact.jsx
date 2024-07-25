import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <h2 className='in-touch'>Get In Touch</h2>
      <div className="contact-info">
        <div className="contact-section-one">
          <h3>Locations:</h3>
          <div className="location-group">
            <div className="location-one">
              <p style={{fontWeight: 'bolder', fontSize:'19px'}}>New York Office</p>
              <p>1234 Broadway Ave</p>
              <p>Suite 5678</p>
              <p>New York, NY 10001</p>
              <p>555-555-1234</p>
            </div>
            <div className="location-two">
              <p style={{fontWeight: 'bolder', fontSize:'18px'}}>Northern Colorado Office</p>
              <p>1234 Alpine Road</p>
              <p>Suite 200</p>
              <p>Fictionville, CO 80000</p>
              <p>555-555-5678</p>
            </div>
          </div>
        </div>
        <div className="contact-section-two">
          <h3>Hours:</h3>
          <p className='hours'>Monday-Friday: 10am - 4pm (EST)</p>
          <p className='hours'>Weekends: Closed</p>
        </div>
        <div className="contact-section-three">
          <h3>Email Support:</h3>
          <p>support@wthrspottr.com</p>
        </div>
      </div>
      <div className="contact-form">
        <h3 className='form-header'>Message Us</h3>
        <p>Our team will get back to you in 1-3 business days</p>
        <form>
          <div className="form-group">
            <label>Name:</label>
            <div className="name-inputs">
              <input className='first' type="text" name="name" placeholder="First" required />
              <input className='last' type="text" name="lastName" placeholder="Last" required />
            </div>
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input className='email' type="email" name="email" required />
          </div>
          <div className="form-group">
            <label className='label-message'>Message:</label>
            <textarea className='message' name="message" required></textarea>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
