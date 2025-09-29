import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import movies from '../../../data/movies.json';

const MovieLinkTest = () => {
    const navigate = useNavigate();

    const handleNavigate = (id) => {
        console.log('Navigating to movie:', id);
        navigate(`/movies/${id}`);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Test Movie Navigation</h2>

            <h3>Test với Link component:</h3>
            {movies.slice(0, 3).map(movie => (
                <div key={movie.id} style={{ margin: '10px 0' }}>
                    <Link
                        to={`/movies/${movie.id}`}
                        style={{ display: 'block', padding: '10px', border: '1px solid #ccc', textDecoration: 'none' }}
                    >
                        Link: {movie.title} (ID: {movie.id})
                    </Link>
                </div>
            ))}

            <h3>Test với navigate function:</h3>
            {movies.slice(0, 3).map(movie => (
                <div key={movie.id} style={{ margin: '10px 0' }}>
                    <button
                        onClick={() => handleNavigate(movie.id)}
                        style={{ display: 'block', padding: '10px', border: '1px solid #ccc', cursor: 'pointer' }}
                    >
                        Navigate: {movie.title} (ID: {movie.id})
                    </button>
                </div>
            ))}
        </div>
    );
};

export default MovieLinkTest;
