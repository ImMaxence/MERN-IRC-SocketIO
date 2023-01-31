require('dotenv').config();
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URL);
const express = require("express")
const app = express()
const cors = require("cors");
const { Socket } = require('socket.io');
const http = require('http').Server(app);
const PORT = 8080
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

app.use(cors())
let users = []

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`)

    socket.on("join_room", room => {
        socket.join(room);
        getHistoryChannel(room)
    })

    socket.on("leave_room", room => {
        socket.leave(room);
    })

    socket.on("message", data => {
        chat2db(data, socket)
    })

    socket.on("newUser", data => {
        users.push(data)
        socketIO.emit("newUserResponse", users)
        user2db(data.userName)
    })

    socket.on("welcome_msg", data => {
        socketIO.emit("reponse_welcome", data);
    })

    socket.on("leave_room_msg", data => {
        socketIO.emit("leave_room_2", data);
    })

    socket.on('disconnect', () => {
        console.log(`⚡: disconnect!`)
        users = users.filter(user => user.socketID !== socket.id)
        socketIO.emit("newUserResponse", users)
        socket.disconnect()
    });
});

app.get("/api", (req, res) => {
    res.json({ message: "Hello" })
});


http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

//Fonctions
async function user2db(usr) {
    await client.connect();
    const db = client.db('myTask');
    const collection = db.collection('users');
    try {
        const dataUser = await collection.find({ realname: usr }).toArray();
        await client.close();
        if (dataUser.length == 0) {
            await client.connect();
            await collection.insertOne(
                {
                    realname: usr,
                }
            );
            await client.close();
        }
        await getHistoryPrivate(usr)
        await getHistoryChannel('general')
    } catch (e) {
        throw (e);
    }
};

async function chat2db(msg, socket) {
    switch (msg.text.split(" ")[0]) {
        case "/nick":
            nickCommand(msg);
            break;
        case "/list":
            listCommand(msg);
            break;
        case "/create":
            createCommand(msg);
            break;
        case "/delete":
            deleteCommand(msg);
            break;
        case "/join":
            joinCommand(msg, socket);
            break;
        case "/quit":
            quitCommand(msg);
            break;
        case "/users":
            usersCommand();
            break;
        case "/msg":
            msgCommand(msg);
            break;
        default:
            defaultCommand(msg);
    }
};

async function nickCommand(msg) {
    let newName = msg.text.split(" ")[1];
    let response = [];
    if (newName == undefined | newName == '') {
        response.push(msg.name)
        response.push('Error')
    }
    else {
        try {
            await client.connect();
            const db = client.db('myTask');
            const collection = db.collection('users');
            let exist = await collection.find({ realname: newName }).toArray();
            await client.close();
            if (exist.length == 0) {
                await client.connect();
                const db = client.db('myTask');
                const collection = db.collection('users');
                await collection.updateOne({ realname: msg.name }, { $set: { realname: newName } });
                await client.close();
                response.push(newName)
            }
            else {
                response.push(msg.name)
                response.push('Double')
            }
        } catch (e) {
            throw (e);
        }
    }
    socketIO.emit("commandNick", response);
}

async function listCommand(msg) {
    let channelName = msg.text.split(" ")[1];
    let reponse = [];
    if (channelName == undefined) {
        await client.connect();
        const db = client.db('myTask');
        const collection = db.collection('channels');
        try {
            const datachannel = await collection.find().toArray();
            await client.close();
            if (datachannel.length > 0) {
                for (let n = 0; n < datachannel.length; n++) {
                    reponse.push(datachannel[n].channelName);
                }
            }
        } catch (e) {
            throw (e);
        }
    }
    else {
        await client.connect();
        const db = client.db('myTask');
        const collection = db.collection('channels');
        try {
            const datachannel = await collection.find({ channelName: channelName }).toArray();
            await client.close();
            if (datachannel.length > 0) {
                reponse.push(datachannel[n].channelName);
            }
        } catch (e) {
            throw (e);
        }
    }
    socketIO.emit("commandList", reponse);
}

async function createCommand(msg) {
    let channelName = msg.text.split(" ")[1];
    let response = [];
    if (channelName == undefined | channelName == '') {
        response.push(msg.text.split(" ")[1])
        response.push('Error')
    }
    else {
        try {
            await client.connect();
            const db = client.db('myTask');
            const collection = db.collection('channels');
            let exist = await collection.find({ channelName: channelName }).toArray();
            await client.close();
            if (exist.length == 0) {
                await client.connect();
                const db = client.db('myTask');
                const collection = db.collection('channels');
                await collection.insertOne({ channelName: channelName });
                await client.close();
                response.push('Done')
            }
            else {
                response.push(msg.text.split(" ")[1])
                response.push('Double')
            }
        } catch (e) {
            throw (e);
        }
    }
    socketIO.emit("commandCreate", response);
}

async function deleteCommand(msg) {
    let channelName = msg.text.split(" ")[1];
    let response = [];
    if (channelName == undefined | channelName == '') {
        response.push(msg.text.split(" ")[1])
        response.push('Error')
    }
    else {
        try {
            await client.connect();
            const db = client.db('myTask');
            const collection = db.collection('channels');
            let exist = await collection.find({ channelName: channelName }).toArray();
            await client.close();
            if (exist.length > 0) {
                await client.connect();
                const db = client.db('myTask');
                const collection = db.collection('channels');
                await collection.deleteOne({ channelName: channelName });
                await client.close();
                response.push('Done')
            }
            else {
                response.push(msg.text.split(" ")[1])
                response.push('None')
            }
        } catch (e) {
            throw (e);
        }
    }
    socketIO.emit("commandDelete", response);
}

async function joinCommand(msg, socket) {
    let channelName = msg.text.split(" ")[1];
    let response = [];
    if (channelName == undefined | channelName == '') {
        response.push(msg.text.split(" ")[1])
        response.push('Error')
    }
    else {
        try {
            await client.connect();
            const db = client.db('myTask');
            const collection = db.collection('channels');
            let exist = await collection.find({ channelName: channelName }).toArray();
            await client.close();
            if (exist.length > 0) {
                console.log("to channel")
                socket.join(channelName);
                socket.emit("join_room_2", channelName);
                getHistoryChannel(channelName);
            }
            else {
                response.push(msg.text.split(" ")[1])
                response.push('None')
            }
        } catch (e) {
            throw (e);
        }
    }
}

async function leaveCommand(msg) {
    let channelName = msg.text.split(" ")[1];
    let response = [];
    if (channelName == undefined | channelName == '') {
        response.push(msg.text.split(" ")[1])
        response.push('Error')
    }
    else {
        try {
            await client.connect();
            const db = client.db('myTask');
            const collection = db.collection('channels');
            let exist = await collection.find({ channelName: channelName }).toArray();
            await client.close();
            if (exist.length > 0) {
                socketIO.leave(channelName);
            }
            else {
                response.push(msg.text.split(" ")[1])
                response.push('None')
            }
        } catch (e) {
            throw (e);
        }
    }
}

async function usersCommand() {
    socketIO.emit('commandUsers', users)
}

async function msgCommand(msg) {
    let receiver = msg.text.split(" ")[1];
    let response = [];
    if (receiver == undefined | receiver == '') {
        response.push(receiver)
        response.push('Error')
        socketIO.emit("commandMsg", response);
    }
    else {
        try {
            await client.connect();
            const db = client.db('myTask');
            const collection = db.collection('users');
            let exist = await collection.find({ realname: receiver }).toArray();
            await client.close();
            if (exist.length > 0) {
                await client.connect();
                const db = client.db('myTask');
                const collection = db.collection('privates');
                await collection.insertOne({
                    from: msg.name,
                    to: receiver,
                    message: msg.text.slice(6 + receiver.length),
                    timestamp: msg.timestamp
                });
                await client.close();
                console.log("Sending Message")
                socketIO.emit("commandMsg", msg);
            }
            else {
                response.push(receiver)
                response.push('None')
                socketIO.emit("commandMsg", response);
            }
        } catch (e) {
            throw (e);
        }
    } 8
}


async function defaultCommand(msg) {

    socketIO.to(msg.room).emit("messageResponse", msg)
    try {
        await client.connect();
        const db = client.db('myTask');
        const collection = db.collection('messages');
        await collection.insertOne({
            realname: msg.name,
            channelName: msg.room,
            message: msg.text,
            timestamp: msg.timestamp
        });
        await client.close();
    } catch (e) {
        throw (e);
    }
}

async function getHistoryChannel(room) {
    try {
        await client.connect();
        const db = client.db('myTask');
        const collection = db.collection('messages');
        let exist = await collection.find({ channelName: room }).toArray();
        await client.close();
        socketIO.emit("historyChannel", exist)
    } catch (e) {
        throw (e);
    }
}

async function getHistoryPrivate(user) {
    try {
        await client.connect();
        const db = client.db('myTask');
        const collection = db.collection('privates');
        let exist = await collection.find({ to: user }).toArray();
        await client.close();
        socketIO.emit("historyPrivate", exist)
    } catch (e) {
        throw (e);
    }
}