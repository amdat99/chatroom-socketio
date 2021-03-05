
import './App.css'
import React, { useState, useEffect } from "react";
import io from 'socket.io-client';
let socket



function App() {
  const rooms = ['1','2','3'];
  const [room, setRoom] = useState(rooms[0]);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  
  useEffect(() => {
    if (room) initiateSocket(room);
    enterChat((err, data) => {
      if(err) return;
      setChat([data, ...data]);
    });
    return () => {
      disconnectSocket();
    }
  }, [room]);
  

  
   const initiateSocket = (room) => {
    socket = io('http://localhost:8000',{transports: ['websocket']});
    console.log(`socket connected`);
    if (socket && room) socket.emit('join', room);
  }
   
  
  const disconnectSocket = () => {
    console.log('socket disconnected');
    if(socket) socket.disconnect();
  }
   
  
  const enterChat = (data) => {
    if (!socket) return(true);
    socket.on('chat', message => {
      console.log('message recieved');
      return data(null, message);
    });
  }
   
  const sendMessage = (room, message) => {
    if (socket) socket.emit('chat', { message, room });
  }
    


  return (
    <div>

      <button onClick={()=> sendMessage(room,message)}>Send</button>
      { chat.map((message,i) => 
      <p key={i}>{message}</p>) }
    </div>
  );
}
export default App;
