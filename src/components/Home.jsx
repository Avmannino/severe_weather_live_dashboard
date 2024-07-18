import React from 'react';
import './Home.css';


const featuresImage = './features.png';
const hourlyDemo = './hourly_demo.mp4';
const radarDemo = './radar_demo.mp4';
const buttonDemo = './alert_button_demo.mp4'
const alertDemo = './alert_demo.mp4'


const Home = () => {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Welcome to SPOT'R</h1>
            </header>
            <main className="home-main">
                <section className="intro">
                    <p className='emphasized-text'>Stay two steps ahead of the storm with</p>
                    <p className='spottr-text'>SPOT'R</p>
                    <p className='smaller-text'>The ultimate tool for precise, real-time weather and data monitoring, all in one place.</p>
                    <div className="button-container">
                        <button className="trial-button">Start a Free Trial</button>
                        <button className="demo-button" onClick={() => window.location.href='/dashboard'}>Try a Live Demo</button>
                    </div>
                </section>
            </main>
                <section className="our-software">
                    <h2 className='software-header'>OUR SOFTWARE</h2>
                    <h3 className='easy-powerful'>Easy, powerful software</h3>
                    <h4 className='features-header'>Web Dashboard App</h4>
                    <ul className='features'>
                        <li>Customizable to your organization’s policies, team structure, and more</li>
                        <li>See any relevant risks today that could disrupt activities (e.g., heat, storms)</li>
                        <li>Automated instructions for your team when weather disrupts</li>
                        <li>Works with or without our on-site hardware</li>
                        <li>Works with or without our on-site hardware</li>
                    </ul>
                    <img src={featuresImage} className='features-img' alt="features-image"/>

                    <h4 className='critical-communications'>Critical Communications</h4>
                    <p className='critical-motto'>Real time NWS alerts for your specific location:</p>
                    <ul className='communications-content'>
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
                    

                    <h4 className='realtime-radar'>Real-Time Radar</h4>
                    <p className='radar-content'>See into the future with the next 7-days worth of forecasted data.</p>
                    <p className='radar-content'>Click each day to see the hourly projected forecasted data</p>
                    <video autoPlay muted loop className="radar_demo">
                        <source src={radarDemo} type="video/mp4" />
                    </video>

                    <h4 className='features-forecast'>Weekly and Hourly Forecasts</h4>
                    <p className='forecast-content'>See into the future with the next 7-days worth of forecasted data.</p>
                    <p className='forecast-content'>Click each day to see the hourly projected forecasted data</p>
                    <video autoPlay muted loop className="hourly_demo">
                        <source src={hourlyDemo} type="video/mp4" />
                    </video>


                </section>
                {/* <section className="features">
                    <h2>Features</h2>
                    <ul>
                        <li>Real-time weather updates</li>
                        <li>Detailed weather reports</li>
                        <li>Interactive maps</li>
                        <li>Customizable alerts</li>
                    </ul>
                </section> */}
            <footer className="home-footer">
                <p>&copy; 2024 SPOT'R. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
