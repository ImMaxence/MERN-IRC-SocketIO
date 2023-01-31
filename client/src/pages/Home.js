import React, { useState } from 'react';
import MyChat from '../components/MyChat';
import Overlay from '../components/Overlay';
import Send from '../components/Send';
import User from '../components/User';

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Welcome from '../components/Welcome';
import Leave from '../components/Leave';
import Error from '../components/Error';


const Home = ({ socket }) => {

    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [messages_h, setMessagesH] = useState([]);
    const [private_msg, setPrivate] = useState([]);
    const [options, setOptions] = useState([]);
    const lastMessageRef = useRef(null);
    const [newGroup, setNewGroup] = useState('');
    const [bool_group, setBool_group] = useState(true);
    const [response_wel, setWel] = useState('');
    const [leave_chat, setLeave] = useState('');

    const leave_msg = localStorage.getItem("userName") + " quit the group !";
    const general = 'general';



    useEffect(() => {
        socket.on('reponse_welcome', (data) => setWel(data));
    }, [response_wel]);

    useEffect(() => {
        socket.on('leave_room_2', (data) => setLeave(data));
    }, [leave_chat]);

    useEffect(() => {
        socket.on('messageResponse', (data) => setMessages([...messages, data]));
    }, [socket, messages]);

    useEffect(() => {
        socket.on('historyChannel', (data) => {
            console.log(JSON.stringify(data))
            for (let n = 0; n < data.length; n++) {
                setMessagesH(messages_h => [...messages_h, (data[n].realname === localStorage.getItem('userName') ? (
                    <div className="container_wrap" key={n}>
                        <div className="container_yourchat">
                            <div className="yournotif">
                                <div className="chat_text">

                                    <p>{data[n].message}</p>
                                </div>
                            </div>
                        </div>
                        <div className="timedate_your">
                            {data[n].timestamp}
                            <h2>@{data[n].realname}</h2>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="container_mynotif" key={n}>
                            <div className="mynotif">
                                <div className="chat_text">
                                    <p>{data[n].message}</p>
                                </div>
                            </div>

                        </div>
                        <div className="timedate_my">
                            {data[n].timestamp}
                            <h2>@{data[n].realname}</h2>
                        </div>
                    </div>
                ))])
            }
        });
    }, [socket, messages]);

    useEffect(() => {
        socket.on('historyPrivate', (data) => {
            for (let n = 0; n < data.length; n++) {
                setOptions(options => [...options, (<div key={n} className="modal_chat_content">
                    <div className="time_user">
                        <p>{data[n]['timestamp']}</p>
                        <p>@{data[n]['from']}</p>
                    </div>
                    <div className="msg_priv_notif">
                        <p>{data[n]['message']}</p>
                    </div>
                </div>)])
            }
        });
    }, [socket, messages]);

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {

        socket.on('commandMsg', (data) => {
            const text = data.text.slice(6 + data.text.split(" ")[1].length)
            if (data.text.split(" ")[1] === localStorage.getItem("userName")) {
                setPrivate([...private_msg, (<div className="modal_chat_content">
                    <div className="time_user">
                        <p>{data.timestamp}</p>
                        <p>@{data.name}</p>
                    </div>
                    <div className="msg_priv_notif">
                        <p>{text}</p>
                    </div>
                </div>)
                ]);
            }
        })
    }, [socket, private_msg]);

    const joinRoom = () => {
        const userName_wel = localStorage.getItem("userName") + " joined the group !";
        if (newGroup !== "") {
            socket.emit("welcome_msg", userName_wel)
            setMessages([])
            setMessagesH([])
            socket.emit("leave_room", newGroup);
            localStorage.removeItem('room')
            setWel('')
            setLeave('')
            console.log(newGroup)
            localStorage.setItem('room', newGroup);
            socket.emit("join_room", newGroup);
        }
    }

    const handleCheck_group = () => {
        const send_msg = document.getElementById("send_msg_group");

        if (send_msg.value === "") {
            setBool_group(true);

        }
        else {
            setBool_group(false);
        }
    }

    const handleShow_chat = () => {
        const show_chat = document.getElementById("all_chat");
        show_chat.style.display = "block";
    }

    const handleShow_chat_close = () => {
        const show_chat = document.getElementById("all_chat");
        show_chat.style.display = "none";
    }

    const handleShow_group = () => {
        const show_chat = document.getElementById("all_chat_group");
        show_chat.style.display = "block";
    }

    const handleShow_group_close = () => {
        const show_chat = document.getElementById("all_chat_group");
        show_chat.style.display = "none";
    }

    const handleDisco = () => {
        const showdisco = document.getElementById("disco");
        const showoption = document.getElementById("option");
        showdisco.style.display = "none";
        showoption.style.display = "block";
        localStorage.removeItem('userName');
        localStorage.removeItem('room')
        navigate('/');
        window.location.reload();
    }

    const handleShowOption = () => {
        const showdisco = document.getElementById("disco");
        const showoption = document.getElementById("option");
        showdisco.style.display = "block";
        showoption.style.display = "none";
    }

    const handleLeaveChat = () => {
        const showdisco = document.getElementById("disco");
        const showoption = document.getElementById("option");
        showdisco.style.display = "none";
        showoption.style.display = "block";
        socket.emit("leave_room", newGroup);
        localStorage.removeItem('room')
        setMessages([])
        setWel('')
        socket.emit("leave_room_msg", leave_msg);
        setLeave('')

        localStorage.setItem('room', general);
        socket.emit("join_room", general);
    }

    const handleSimpleClose = () => {
        const showdisco = document.getElementById("disco");
        const showoption = document.getElementById("option");
        showdisco.style.display = "none";
        showoption.style.display = "block";
    }


    return (
        <>
            <div className="all_chat" id='all_chat'>
                <div className="container_modal_chat">
                    <div className="modal_chat">
                        <div className="close_chat">
                            <button onClick={handleShow_chat_close}>X</button>
                        </div>
                        <div className="container_private">
                            {options}
                            {private_msg}
                        </div>
                    </div>
                </div>
            </div>
            <div className="all_chat_group" id='all_chat_group'>
                <div className="container_modal_group">
                    <div className="modal_group">
                        <div className="close_group">
                            <button onClick={handleShow_group_close}>X</button>
                        </div>
                        <div className="modal_group_content">
                            <div className="modal_title">
                                <h1>Join a group</h1>
                            </div>
                            <div className="name_group">
                                <input id='send_msg_group' type="text" placeholder="Enter group's name" onKeyUp={handleCheck_group} onChange={(e) => setNewGroup(e.target.value)} />
                                <button disabled={bool_group} onClick={joinRoom} id='but_group'>OK</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="full_chat">
                <div className="flex_left">
                    <div className="button_left">
                        <div className="pseudo">
                            <h2>Welcome <span>@{localStorage.getItem("userName")}</span></h2>

                        </div>
                    </div>
                    <div className="hidden_div"></div>
                    <div className="left_slide">
                        <div className="buttons_add">

                            <button onClick={handleShow_group}>New Chat</button>
                            <button onClick={handleShow_chat}>Notif</button>

                        </div>
                        <User socket={socket} />
                    </div>
                </div>
                <div className="right_slide">
                    <div className="container_disco">

                        <div className="img_option">
                            <h2>You are in the room : <span>{localStorage.getItem("room")}</span></h2>
                            <img src="./img/option.png" alt="not_found" id='option' onClick={handleShowOption} />
                        </div>
                        <div className="disco" id='disco'>

                            <button onClick={handleDisco}>Disconnect</button>
                            <button onClick={handleLeaveChat}>Leave Chat</button>
                            <button onClick={handleSimpleClose}>Close</button>

                        </div>
                    </div>

                    {messages_h}
                    <MyChat messages={messages} lastMessageRef={lastMessageRef} />

                    <Send socket={socket} />

                </div>
            </div>
            <Overlay />
        </>
    );
};

export default Home;