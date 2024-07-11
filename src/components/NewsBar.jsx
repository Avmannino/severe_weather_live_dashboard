// src/components/NewsBar.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Marquee from 'react-fast-marquee';
import './NewsBar.css';

const NewsBar = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNews = async () => {
        try {
            const apiKey = import.meta.env.VITE_SERPAPI_API_KEY;
            console.log('API Key:', apiKey); // Debugging statement
            if (!apiKey) {
                throw new Error('API key is missing');
            }
            const response = await axios.get('/api/search.json', {
                params: {
                    engine: 'google_news',
                    q: 'weather',
                    api_key: apiKey
                }
            });
            console.log('SerpApi Response:', response.data);  // Debugging statement
            const articles = response.data.news_results || [];  // Ensure articles is an array
            setNews(articles);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching news:', error);
            setError('Failed to fetch news');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    if (loading) {
        return <div className="news-bar">Loading news...</div>;
    }

    if (error) {
        return <div className="news-bar">{error}</div>;
    }

    return (
        <div className="news-bar">
            <Marquee speed={100}>
                {news.length > 0 ? (
                    news.map((article, index) => (
                        <div key={index} className="news-item">
                            <a href={article.link} target="_blank" rel="noopener noreferrer">
                                {article.title}
                            </a>
                        </div>
                    ))
                ) : (
                    <div>No news available</div>
                )}
            </Marquee>
        </div>
    );
};

export default NewsBar;
