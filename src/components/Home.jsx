import React from 'react';
import './Home.css';


const featuresImage = './public/features.png';
const featuresNav = './public/features_nav.png';

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
                    <h4 className='features-header'>Web dashboard app</h4>
                    <ul className='features'>
                        <li>Customizable to your organization’s policies, team structure, and more</li>
                        <li>See any relevant risks today that could disrupt activities (e.g., heat, storms)</li>
                        <li>Automated instructions for your team when weather disrupts</li>
                        <li>Works with or without our on-site hardware</li>
                        <li>Works with or without our on-site hardware</li>
                    </ul>
                    <img src={featuresImage} className='features-img' alt="features-image"/>
                    <img src={featuresNav} alt="Features-Nav"/>
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
