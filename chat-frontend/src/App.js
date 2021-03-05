
import './App.css'
import React, { useState, useEffect } from "react";
import io from 'socket.io-client';
let socket



function App() {
  const [createRoom, setCreateRoom] = useState('')
  const [rooms, setRooms] = useState(['1','2','3']);
  const [room, setRoom] = useState(rooms[0]);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  
  useEffect(() => {
    if (room) initiateSocket(room);
    enterChat((err, data) => {
      if(err) return;
      setChat(oldChats =>[data, ...oldChats])
    });
    return () => {
      disconnectSocket();
    }
  }, [room]
  )
  

  
   const initiateSocket = (room) => {
    socket = io('http://localhost:8000',{transports: ['websocket']});
    console.log(`Connecting`);
    if (socket && room) socket.emit('join', room);
  }
   const disconnectSocket = () => {
    console.log('Disconnecting');
    if(socket) socket.disconnect();
  }
   const enterChat = (data) => {
    if (!socket) return;
    socket.on('chat', msg => {
      console.log('message reieved');
      return data(null, msg);
    });
  }
   const sendMessage = (room, message) => {
    if (socket) socket.emit('chat', { message, room });
  }

  const handleInput = (event) => {
    setMessage(event.target.value)
  }

  const  getRoomInput= (event) => {
    setCreateRoom(event.target.value)
  }

  const addRoom = () => {
    if(createRoom){
    setRooms([...rooms,createRoom])
    setCreateRoom('')
    initiateSocket(room)
    }
  }

console.log(rooms)
  

  return (
    <div>
      <div>{room}</div>
      { rooms.map((room, i) =>
       <button onClick={() => setRoom(room) } key={i}>{room}</button>)}

     <input type ='text' onChange={getRoomInput} placeholder="create room"/>
      <button onClick={addRoom}>create room</button> 



      <textarea  type="text" onChange={handleInput} value={message}/>
      <button onClick={()=> sendMessage(room,message)}>Send</button>
      { chat.map((message,i) => 
      <h4 key={i}>{message}</h4>) } 
      
 
    </div>
  );
}
export default App;
