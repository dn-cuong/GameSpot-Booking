// NotFound.jsx
import React from 'react';

import "./NotFound.css"
const NotFound = () => {


    return (
        <div className='text_wrapper'>
            <h1>404</h1>
            <h2>Not Found</h2>
            <p>Sorry, the resource requested could not be found on this server.</p>
            <a href="/">Back to Home</a>
        </div>
    );
};

export default NotFound;
