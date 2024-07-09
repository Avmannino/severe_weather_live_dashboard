import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import Rainstorm from '/Rainstorm.mp4'; // Adjust the path as necessary

function LandingPage() {
    return (
        <div className="container">
            <video autoPlay muted loop className="backgroundVideo">
                <source src={Rainstorm} type="video/mp4" />
            </video>
            <div className="content">
                <h1 className='titleLanding'>SPOTT'R</h1>
                <div className="buttons">
                    <Link to="/dashboard">
                        <button>Dashboard</button>
                    </Link>
                    <Link to="/reports">
                        <button>Reports</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
