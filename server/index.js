const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const Room = require('./models/Room');
const Code = require('./models/Code')
//routers

const roomRouter = require('./routes/roomRoute');
const codeRouter = require('./routes/codeRoute');

const port = 5000;

const app = express();
const server = http.createServer(app);
require('dotenv').config()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Authorization"]
}));


app.use('/api/room', roomRouter);
app.use('/api/code',codeRouter);


mongoose.connect(process.env.MONGO_URI)
    .then((success) => console.log("Connected to MongoDB"))
    .catch(err => console.log("Error connecting"));

server.listen(port, () => {
    console.log(`Running on port ${port}`);
})

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
        allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Authorization"]
    }
})

//Mapping room to the list of socket user
let userRoomMap = new Map();
let socketIdMap = new Map();


io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);
    socket.on('joinroom', async ({ roomId }) => {
        if (!userRoomMap.get(roomId)) {
            userRoomMap.set(roomId, [socket.id]);
            socketIdMap.set(socket.id, roomId);
            socket.join(roomId);
        }
        else {
            const socketIds = userRoomMap.get(roomId);
            if (!socketIds.includes(socket.id)) {
                socketIds.push(socket.id);
                socketIdMap.set(socket.id, roomId);
                socket.join(roomId);
            }
        }
        socket.emit('welcomeToRoom', { userlist: userRoomMap.get(roomId) })
        //console.log(userRoomMap);
    })

    socket.on('codeChange', async ({ roomId, code, lang }) => {
        const decodedLang=decodeURIComponent(lang);
        await Code.findOneAndUpdate({ room: roomId,language:decodedLang},

            { $set: { code: code } },
            { new: true }
        )
        socket.to(roomId).emit('syncCode', { code });
    })


    socket.on('disconnect', async () => {
       
        const roomId = socketIdMap.get(socket.id);
        
        if (userRoomMap.get(roomId)) {
            const arr = userRoomMap.get(roomId);
            userRoomMap.set(roomId, arr.filter(id => id != socket.id))
        }
        //console.log(userRoomMap);
    })
})