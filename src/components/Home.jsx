import React from 'react';
import 'animate.css';
import './Home.css';

const featuresImage = './features.png';
const hourlyDemo = './hourly_demo.mp4';
const radarDemo = './radar_demo.mp4';
const buttonDemo = './alert_button_demo.mp4';
const alertDemo = './alert_demo.mp4';

const Home = () => {
    return (
        <div className="home-container">
            <h1 className="spottr-text snap-section"></h1>
            <main className="home-main">
                <h1 className="spottr-header animate__animated animate__fadeIn animate__delay-5s">SPOTT'R</h1>
                <section className="intro snap-section">
                    <p className="emphasized-text animate__animated animate__fadeInTopLeft animate__delay-1s">A Step Ahead of the Storm...</p>
                    <p className="home-header"></p>
                    <p className="smaller-text animate__animated animate__fadeInUp animate__delay-3s">Real-time storm data, radar insights, and detailed forecasts</p>
                    <p className="emphasized-text-lower animate__animated animate__fadeInBottomRight animate__delay-4s">...we've got you covered.</p>
                    <div className="button-container animate__animated animate__fadeInUp animate__delay-2s">
                        <button className="trial-button" onClick={() => window.location.href = '/sign-up'}>
                            Start a Free Trial
                        </button>
                        <button className="demo-button" onClick={() => window.location.href = '/dashboard'}>
                            Try a Live Demo
                        </button>
                    </div>
                </section>
            </main>
            <section className="our-software snap-section">
                <h2 className="software-header">OUR SOFTWARE</h2>
                <h3 className="easy-powerful">Easy, powerful software</h3>
                <h4 className="features-header">Web Dashboard App</h4>
                <ul className="features">
                    <li>Customizable to your organization’s policies, team structure, and more</li>
                    <li>See any relevant risks today that could disrupt activities (e.g., heat, storms)</li>
                    <li>Automated instructions for your team when weather disrupts</li>
                    <li>Works with or without our on-site hardware</li>
                    <li>Works with or without our on-site hardware</li>
                </ul>
                <img src={featuresImage} className="features-img" alt="features-image" />
            </section>

            <section className='critical-communications snap-section'>
                <h4 className="critical-communications-header">Critical Communications</h4>
                <p className="critical-motto">Real time NWS alerts for your specific location:</p>
                <ul className="communications-content">
                    <li>Tornado Watches and Warnings</li>
                    <li>Severe Thunderstorm Watches and Warnings</li>
                    <li>Flash Flood Watches and Warnings</li>
                    <li>Winter Weather Watches, Warnings, and Advisories</li>
                    <li>A suite of Tropical Watches, Warnings, and Advisories (both coastal and inland)</li>
                </ul>
                <video autoPlay muted loop className="alert-button-demo">
                    <source src={buttonDemo} type="video/mp4" />
                </video>
                <video autoPlay muted loop className="alert-demo">
                    <source src={alertDemo} type="video/mp4" />
                </video>
            </section>
            <section className='realtime-radar snap-section'>
                <h4 className="realtime-radar-header">Real-Time Radar</h4>
                <p className="radar-content">See into the future with the next 7-days worth of forecasted data.</p>
                <p className="radar-content">Click each day to see the hourly projected forecasted data</p>
                <video autoPlay muted loop className="radar_demo">
                    <source src={radarDemo} type="video/mp4" />
                </video>
            </section>
            <section className='features-forecast snap-section'>
                <h4 className="features-forecast-header">Weekly and Hourly Forecasts</h4>
                <p className="forecast-content">See into the future with the next 7-days worth of forecasted data.</p>
                <p className="forecast-content">Click each day to see the hourly projected forecasted data</p>
                <video autoPlay muted loop className="hourly_demo">
                    <source src={hourlyDemo} type="video/mp4" />
                </video>
            </section>
            <footer className="home-footer snap-section">
                <p>&copy; 2024 SPOT'R. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
