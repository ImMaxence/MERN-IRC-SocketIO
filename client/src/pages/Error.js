import React from 'react';
import Cat from '../components/Cat';

const Error = () => {
    return (
        <>
            <Cat />
            <div className="align_cat">
                <div className="error_page">
                    <div className="title_error">
                        <h1>ERROR PAGE</h1>
                    </div>
                    <p>This page does not exist !</p>
                </div>
            </div>
        </>
    );
};

export default Error;