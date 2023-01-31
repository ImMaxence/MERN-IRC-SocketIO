import React, { useState, useEffect } from 'react';

const MyChat = ({ messages, lastMessageRef }) => {

    return (
        <>
            {messages.map((message) =>
                message.name === localStorage.getItem('userName') ? (
                    <div className="container_wrap" key={message.id}>
                        <div className="container_yourchat">
                            <div className="yournotif">
                                <div className="chat_text">

                                    <p>{message.text}</p>
                                </div>
                            </div>
                        </div>
                        <div className="timedate_your">
                            {message.timestamp}
                            <h2>@{message.name}</h2>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="container_mynotif" key={message.id}>
                            <div className="mynotif">
                                <div className="chat_text">
                                    <p>{message.text}</p>
                                </div>
                            </div>

                        </div>
                        <div className="timedate_my">
                            {message.timestamp}
                            <h2>@{message.name}</h2>
                        </div>
                    </div>
                )
            )}
            <div ref={lastMessageRef} />
        </>
    );
}

export default MyChat;