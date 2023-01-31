import React from 'react';

const Welcome = ({ welcome }) => {
    return (
        <>
            <div className='wel_msg'>
                <div className="msg_wel">
                    {welcome}
                </div>
            </div>
        </>
    );
};

export default Welcome;