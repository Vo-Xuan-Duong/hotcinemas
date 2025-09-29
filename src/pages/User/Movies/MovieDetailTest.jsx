import React from 'react';
import { useParams } from 'react-router-dom';

const MovieDetailTest = () => {
    const { id } = useParams();

    return (
        <div style={{ padding: '20px' }}>
            <h1>Movie Detail Test Page</h1>
            <p>Movie ID: {id}</p>
            <p>This is a test page to check if routing works.</p>
        </div>
    );
};

export default MovieDetailTest;
