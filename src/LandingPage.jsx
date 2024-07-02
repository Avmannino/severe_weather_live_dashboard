import React from 'react';
import './LandingPage.css';  
import Rainstorm from '../public/Rainstorm.mp4'; // Adjust the path as necessary

function LandingPage() {
    return (
        <div className="container">
            <video autoPlay muted loop className="backgroundVideo">
                <source src={Rainstorm} type="video/mp4" />
            </video>
            <div className="content">
                <h1 className='titleLanding'>Severe Weather Monitoring Dashboard</h1>
                <p className='mottoLanding'>Stay updated with the latest severe weather alerts and tornado tracking.</p>
                <div className="buttons">
                    <button onClick={() => console.log('Navigate to dashboard')}>Dashboard</button>
                    <button onClick={() => console.log('Navigate to reports')}>Reports</button>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
