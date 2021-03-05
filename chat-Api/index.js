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
   console.log(`Connected ${socket.id}`);
   
   socket.on('disconnect', () =>
      console.log(`Disconnected ${socket.id}`));
   
      socket.on('join', (room) => {
      console.log(` ${socket.id} joined ${room}`);
      socket.join(room);
   });
   socket.on('chat', (data) => {
      const { message, room } = data;
      console.log(`message: ${message}, room: ${room}`);
      io.to(room).emit('chat', message);
   });
});


