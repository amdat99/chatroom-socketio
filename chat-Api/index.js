const webSocketsServerPort = 8000;
const socket = require('socket.io')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

const server = app.listen(webSocketsServerPort,function()
{console.log("on 8000")});

const io = socket(server)
app.use(bodyParser.json());
app.use(cors())

let rooms = [1,2,3]

app.post('/fetchrooms', (req,res)=>{  // fetch room data
      res.json(rooms);
	})
	
app.post('/addroom',(req,res)=>{  
   let room = req.body.room
   rooms.push(room)
  
   })

 io.on('connection', (socket) => {
   let socketRoom;
   console.log(`Connected ${socket.id}`);
   
   socket.on('disconnect', () =>
      console.log(`Disconnected ${socket.id}`));
   
      socket.on('join', (room) => {
      console.log(` ${socket.id} joined ${room}`);
      socket.join(room);
      socketRoom = room;
   });

   socket.on('switch', (data) => {
      const { prevRoom, nextRoom } = data;
      if (prevRoom) socket.leave(prevRoom);
      if (nextRoom) socket.join(nextRoom);
      socketRoom = nextRoom;
    });
   
   socket.on('chat', (data) => {
      const { message, room } = data;
      console.log(`message: ${message}, room: ${room}`);
      io.to(socketRoom).emit('chat', message);
   });
});


