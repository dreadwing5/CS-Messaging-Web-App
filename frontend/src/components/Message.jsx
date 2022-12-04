import { useState, useEffect } from 'react';
import './message.css';
import io from 'socket.io-client';
const socket = io('http://localhost:8000');

function Message({ userId }) {
  const [message, setMessage] = useState('');
  const [messageReceived, setMessageReceived] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    socket.emit('message', message);
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageReceived(data);
      setMessages((messages) => [...messages, data]);
    });
  }, [socket]);

  return (
    <div className='App'>
      <input
        placeholder='Message...'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button>
      <h1>Message :</h1>
      {messages.map((m) => (
        <div>{m}</div>
      ))}
    </div>
  );
}

export default Message;
