import React, { useState, useEffect } from 'react';

const User = ({ socket }) => {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        socket.on('newUserResponse', (data) => setUsers(data));
    }, [socket, users]);

    console.log(users)

    return (
        <>
            <div className="container_user">
                <div className="user_div">
                    <h1>ACTIVE USER</h1>
                    {users.map((user) => (
                        <button key={user.socketID}>{user.userName}</button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default User;