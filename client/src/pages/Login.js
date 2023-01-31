import React from 'react';
import Overlay from '../components/Overlay';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { useEffect } from 'react';


const Login = ({ socket }) => {

    const navigate = useNavigate();
    const [bool, setBool] = useState(true);
    const [userName, setUserName] = useState('');
    const [newGroup, setNewGroup] = useState('general');

    const userName_wel = userName + " joined the group !";

    localStorage.setItem('room', newGroup);

    useEffect(() => {
        socket.emit("join_room", newGroup);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('userName', userName);
        socket.emit('newUser', { userName, socketID: socket.id });
        socket.emit('welcome_msg', userName_wel);
        navigate("/home");
    };

    const handleCheck = () => {
        const send_msg_login = document.getElementById("send_msg_login");

        if (send_msg_login.value === "") {
            setBool(true);
        }
        else {
            setBool(false);
        }
    };

    return (
        <>
            <Overlay />
            <div className="align_center">
                <div className="login_page">
                    <div className="title_login">
                        <h1>ENTER YOUR NICKNAME</h1>
                    </div>
                    <div className="login_in_but">
                        <input id='send_msg_login' type="text" maxLength="10" onKeyUp={handleCheck} onChange={(e) => setUserName(e.target.value)} />

                        <button id='btn_send_login' onClick={handleSubmit} disabled={bool}>Go</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;