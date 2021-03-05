const webSocketsServerPort = 8000;
const socket = require('socket.io')
const express = require('express')
const cors = require('cors')

const app = express()

const server = app.listen(webSocketsServerPort,function()
{console.log("on 8000")});

const io = socket(server)
app.use(cors())

io.on('connection', (socket) => {
    console.log(`user connected ${socket.id}`);
    
    socket.on('disconnect', () =>
       console.log(`disconnected ${socket.id}`));
    
    socket.on('enter chat', (room) => {
       console.log(` user ${socket.id} entered ${room}`);
       socket.join(room);
    });
    
    socket.on('chat', (data) => {
       const { message, room } = data;
       console.log(`message: ${message}, room: ${room}`);
       io.to(room).emit('chat', message);
    });
 });





