import React from 'react';
import './Loading.css';

const Loading = () => {
    return (
        <div className="loading-container">
            <img src="/tornado_loader.gif" alt="Loading..." className="loading-gif" />
        </div>
    );
};

export default Loading;
