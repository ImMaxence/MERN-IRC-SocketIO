import React from 'react';

const Error = ({ error_msg }) => {
    return (
        <>
            <div className="error_msg_container">
                <div className="align_error">
                    <div className="real_mssg">
                        {error_msg}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Error;