import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

const DebugRouter = () => {
    const params = useParams();
    const location = useLocation();

    return (
        <div style={{ padding: '20px', background: '#f5f5f5', margin: '20px' }}>
            <h3>Debug Router Information</h3>
            <div><strong>Current Path:</strong> {location.pathname}</div>
            <div><strong>Params:</strong> {JSON.stringify(params)}</div>
            <div><strong>Movie ID:</strong> {params.id || 'No ID found'}</div>
            <div><strong>Location State:</strong> {JSON.stringify(location.state)}</div>
            <div><strong>Search:</strong> {location.search}</div>
            <div><strong>Hash:</strong> {location.hash}</div>
        </div>
    );
};

export default DebugRouter;
