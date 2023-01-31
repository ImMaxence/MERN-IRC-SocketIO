import React from 'react';

const Leave = ({ leave }) => {
    return (
        <>
            <div className="leave">
                <div className="msg_leave">
                    {leave}
                </div>
            </div>
        </>
    );
};

export default Leave;