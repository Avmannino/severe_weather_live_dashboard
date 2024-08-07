import React from 'react';
import 'animate.css';
import './Home.css';
import Rainstorm from '/Rainstorm.mp4';

const featuresImage = './features.png';
const hourlyDemo = './hourly_demo.mp4';
const radarDemo = './radar_demo.mp4';
const buttonDemo = './alert_button_demo.mp4';
const alertDemo = './alert_demo.png';
const radarMaps = './radar_options.png';
const twisterGif = './twister.gif';
const carouselDemo = './carousel-demo.mp4'

const Home = () => {
    const scrollToSoftware = () => {
        document.querySelector('.our-software').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="home-container">
            <video autoPlay muted loop className="backgroundVideo">
                <source src={Rainstorm} type="video/mp4" />
            </video>
            <h1 className="spottr-text snap-section"></h1>
            <main className="home-main">
                <div className="gif-animation">
                    <img src={twisterGif} alt="Weather Animation" className="gif-image" />
                </div>
                <h1 className="spottr-header">SPOTT'R</h1>
                <section className="intro snap-section">
                    <p className="home-header"></p>
                    <p className="smaller-text animate__animated animate__fadeInUp animate__delay-1s">Real-time weather data, radar insights, and detailed forecasts</p>
                    <div className="button-container animate__animated animate__fadeInUp animate__delay-2s">
                        <button className="trial-button" onClick={() => window.location.href = '/signup'}>
                            Start a Free Trial
                        </button>
                        <button className="plans-button" onClick={() => window.location.href = '/pricing'}>
                            Plans & Pricing
                        </button>
                    </div>
                </section>
                <button className="learn-more-button animate__animated animate__fadeInUp animate__delay-1s" onClick={scrollToSoftware}>
                    <p className='learn-more animate__animated animate__fadeInUp animate__delay-1s'>Learn More</p>
                    <span className="caret animate__animated animate__fadeInUp animate__delay-2s">&#9660;</span>
                </button>
            </main>
            <section className="our-software snap-section">
                <h2 className="software-header">OUR SOFTWARE</h2>
                <h3 className="easy-powerful">Easy, powerful software</h3>
                <h4 className="features-header">Web Dashboard App</h4>
                <ul className="features">
                    <li>Customizable to your organization’s policies, team structure, and more.</li>
                    <li>See any relevant risks today that could disrupt activities. (e.g., heat, storms)</li>
                    <li>Automated instructions for your team when weather disrupts.</li>
                    <li>Works with or without our on-site hardware.</li>
                </ul>
                <img src={featuresImage} className="features-img" alt="features-image" />
            </section>
            <p className='line-break'>&nbsp;</p> {/* Line break */}
            <section className='critical-communications snap-section'>
                <h2 className="software-header"></h2>
                <h3 className="stay-ahead">Stay Ahead of the Storm</h3>
                <h4 className="critical-communications-header">Critical Communications</h4>
                <p className="critical-motto">Real-time NWS alerts for your specific location:</p>
                <ul className="communications-content">
                    <li>Tornado Watches and Warnings.</li>
                    <li>Severe Thunderstorm Watches and Warnings.</li>
                    <li>Flash Flood Watches and Warnings.</li>
                    <li>Winter Weather Watches, Warnings, and Advisories.</li>
                    <li>A suite of Tropical Watches, Warnings, and Advisories.</li>
                </ul>
                <video autoPlay muted loop className="alert-button-demo">
                    <source src={buttonDemo} type="video/mp4" />
                </video>
                <img src={alertDemo} className="alert-demo" alt="alert-image" />
                <video autoPlay muted loop className="alert-carousel">
                    <source src={carouselDemo} type="video/mp4" />
                </video>
            </section>
            <p className='line-break'>&nbsp;</p> {/* Line break */}
            <section className='realtime-radar'>
                <h4 className="realtime-radar-header">Real-Time Radar</h4>
                <p className="radar-content">See into the future with the next 7-days worth of forecasted data.</p>
                <ul className='radar-list'>
                    <li>Real-time updates to track current weather conditions.</li>
                    <li>High-Resolution imagery for precise weather monitoring.</li>
                    <li>Layer Customization to customize radar layers and type.</li>
                    <li>Interactive Map with zoom and pan capabilities for detailed local and regional views.</li>
                    <li>Playback Controls to view past radar data and predict weather movement.</li>
                </ul>
                <video autoPlay muted loop className="radar_demo">
                    <source src={radarDemo} type="video/mp4" />
                </video>
                <img src={radarMaps} className="radar-maps" alt="map-options" />
                <h4 className="features-forecast-header">Weekly and Hourly Forecasts</h4>
                <p className="forecast-content">Click each day to see the hourly projected forecasted data.</p>
                <ul className='forecast-list'>
                    <li>Detailed weather predictions for the next 24 hours.</li>
                    <li>Hourly breakdown of temperature, weather conditions and descriptions.</li>
                    <li>Access to historical hourly weather data for trend analysis and comparison.</li>
                </ul>
                <video autoPlay muted loop className="hourly_demo">
                    <source src={hourlyDemo} type="video/mp4" />
                </video>
                <footer className="home-footer snap-section">
                    <button className="pricing-button" onClick={() => window.location.href = '/pricing'}>
                        Plans & Pricing
                    </button>
                    <p>&copy; 2024 SPOTT'R. All rights reserved.</p>
                </footer>
            </section>
        </div>
    );
};

export default Home;
