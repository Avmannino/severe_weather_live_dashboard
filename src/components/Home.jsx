import React from 'react';
import './Home.css';

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
                    <p className='smaller-text'>The ultimate tool for precise, real-time weather and data monitoring. All in one place.</p>
                    <div className="button-container">
                        <button className="trial-button">Start a Free Trial</button>
                        <button className="demo-button" onClick={() => window.location.href='/dashboard'}>Try a Live Demo</button>
                    </div>
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
            </main>
            <footer className="home-footer">
                <p>&copy; 2024 SPOT'R. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
