
import './App.css'
import React, { useState, useEffect } from "react";
import io from 'socket.io-client';
let socket



function App() {
  const [createRoom, setCreateRoom] = useState('')
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState(rooms[0]);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  
  useEffect(() => {
     fetchRooms()
    if (room) initiateSocket(room);
   
    enterChat((err, data) => {
      if(err) return;
      setChat(existingdata =>[data, ...existingdata])
    });
    return () => {
      disconnectSocket();
    }
  }, [room]
  )

  

const  fetchRooms =() =>{
  fetch('http://localhost:8000/fetchrooms',{
  method: 'post',
  headers: {'Content-Type': 'application/json'},
  })
  .then(res => res.json())
  .then(data=> {
      setRooms(data)
  })
}


const  sendRoom = async() =>{
  fetch('http://localhost:8000/addroom',{
  method: 'post',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    room: createRoom ,
    })
})
fetchRooms() 
refreshPage()
}
  
  

  
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
    socket.on('chat', message => {
      console.log('message reieved');
      return data(null, message);
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
    sendRoom()
    setCreateRoom()
    }
  }

  function refreshPage() {
    window.location.reload(false);
  }
console.log(chat)
  

  return (
    <div>
      <div>{room}</div>
      { rooms.map((room, i) =>
       <button onClick={() => {setRoom(room);  }} key={i}>{room}</button>)}

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
