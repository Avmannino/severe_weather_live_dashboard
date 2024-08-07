import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <h1>About Us</h1>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          Our mission is to empower individuals and organizations with the most accurate and timely weather information to make informed decisions. We strive to provide a comprehensive and user-friendly weather dashboard that integrates real-time data, advanced forecasting tools, and intuitive visualizations. By leveraging cutting-edge technology and data analytics, we aim to enhance preparedness and response to severe weather events, ensuring safety and optimizing operational efficiency for our users.
        </p>
      </section>


      <section className="about-section">
        <h2>Our Values</h2>
        <h4 className='values-header'>Accuracy</h4>
        <p className='values'>
        Ensuring that every piece of weather data is reliable and precise.
        </p>
        <h4 className='values-header'>Transparency</h4>
        <p className='values'>
        Fueling our approach to obtaning and visualizing data clearly and openly. 
        </p>
        <h4 className='values-header'>User-Centricity</h4>
        <p className='values'>
        Designing solutions that cater to the diverse needs of our users
        </p>
        <h4 className='values-header'>Innovation</h4>
        <p className='values'>
        Constantly evolving with the latest advancements in technology
        </p>
      </section>

      <section className="about-section">
        <div className="contact">
        <p>Questions? <a href="/contact-us">Contact Us!</a></p>
      </div>
      </section>
    </div>
  );
};

export default About;
