import { useState, useEffect } from 'react';

const Send = ({ socket }) => {

    const [bool, setBool] = useState(true);
    const [message, setMessage] = useState('');

    const dateNow = (new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(Date.now()));
    const newGroup = localStorage.getItem('room');

    const [error_msg, setError] = useState('');

    const [nick, setNick] = useState([]);
    const [list, setList] = useState([]);
    const [create, setCreate] = useState([]);
    const [delete_room, setDelete] = useState([]);
    const [listUser, setListUser] = useState([]);
    const [msg, setMsg] = useState([]);
    const [historyRoom, setHistoryRoom] = useState([]);
    const [historyPrivate, setHistoryPrivate] = useState([]);

    useEffect(() => {

        const appear_error_div = document.querySelector('.error_msg_container');
        //const change_color = document.getElementById('appear_error');

        socket.on("commandNick", (data) => {
            setNick(data);
            if (data.length > 1) {
                switch (data[1]) {
                    case 'Error':
                        setError("You are not set a pseudo, please retry");
                        appear_error_div.classList.add('animate')
                        break;
                    case 'Double':
                        setError("The pseudo is already taken");
                        appear_error_div.classList.add('animate')
                        break;
                }
            }
            else {
                localStorage.setItem("userName", data[0])
                setError("Change username done ! Please send message");
                appear_error_div.classList.add('animate')
            }
        });
        socket.on("commandList", (data) => {
            setList(data);
            setError("All room : " + JSON.stringify(data))
            appear_error_div.classList.add('animate')

        });
        socket.on("commandCreate", (data) => {
            setCreate(data);
            if (data.length > 1) {
                switch (data[1]) {
                    case 'Error':
                        setError("Name's room is not good, please retry");
                        appear_error_div.classList.add('animate')
                        break;
                    case 'Double':
                        setError("The room name is already taken");
                        appear_error_div.classList.add('animate')
                        break;
                }
            }
            else {
                setError("Done, room created !");
                appear_error_div.classList.add('animate')
            }
        });
        socket.on("commandDelete", (data) => {
            setDelete(data);
            if (data.length > 1) {
                switch (data[1]) {
                    case 'Error':
                        setError("Name's room is not good, please retry");
                        appear_error_div.classList.add('animate')
                        break;
                    case 'None':
                        setError("This room doesn't exist");
                        appear_error_div.classList.add('animate')
                        break;
                }
            }
            else {
                setError("Room deleted !");
                appear_error_div.classList.add('animate')

            }
        });
        socket.on("commandUsers", (data) => {
            setListUser(data)
            setError("All users : " + JSON.stringify(data[0]));
            appear_error_div.classList.add('animate')

        });
        socket.on("commandMsg", (data) => {
            setMsg(data);
            if (data.length > 1) {
                switch (data[1]) {
                    case 'Error':
                        setError("Write a good pseudo, please retry");
                        appear_error_div.classList.add('animate')
                        break;
                    case 'None':
                        setError("This user doesn't exist");
                        appear_error_div.classList.add('animate')
                        break;
                }
            }
            else {
                setError("Message sent !");
                appear_error_div.classList.add('animate')

            }
        });
        socket.on("reponse_welcome", (data) => {
            setError(data)
            console.log("eeeeeeeeeeeeeeeeee")
            appear_error_div.classList.add('animate')
        });
        socket.on("leave_room_2", (data) => {
            setError(data)
            console.log("ddddddddddddddddddddddd")
            appear_error_div.classList.add('animate')
        });
        socket.on("historyChannel", (data) => {
            setHistoryRoom(data)
        });
        socket.on("historyPrivate", (data) => {
            setHistoryPrivate(data)
        });
        socket.on("join_room_2", (data) => {
            console.log("room name : " + data)
            socket.emit("join_room", data);
        });
    }, []);

    const handleCheck = () => {
        const send_msg_input = document.getElementById("send_msg_input");

        if (send_msg_input.value === "") {
            setBool(true);

        }
        else {
            setBool(false);
        }
    }

    const handleSub = (e) => {
        const send_msg_input = document.getElementById("send_msg_input");
        const appear_error_div = document.querySelector('.error_msg_container');
        e.preventDefault();

        appear_error_div.classList.remove('animate');

        if (message.trim() && localStorage.getItem('userName')) {
            socket.emit('message', {
                text: message,
                name: localStorage.getItem('userName'),
                id: `${socket.id}${Math.random()}`,
                socketID: socket.id,
                timestamp: dateNow,
                room: newGroup,
            });
        }
        send_msg_input.value = "";

        setMessage('');
    }

    return (
        <>

            <div className="error_msg_container" id='appear_error'>
                <div className="align_error">
                    <div className="real_mssg">
                        <p>{error_msg}</p>
                    </div>
                </div>
            </div>

            <div className="container_send">
                <input type="text" id='send_msg_input' onKeyUp={handleCheck} placeholder="Write your message here !" onChange={(e) => setMessage(e.target.value)} />
                <button id='btn_send' disabled={bool} onClick={handleSub}>Send</button>
            </div>
        </>
    );
};

export default Send;