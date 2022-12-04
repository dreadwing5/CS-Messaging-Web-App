import { useState, useEffect } from 'react';
import io from 'socket.io-client';
const socket = io('http://localhost:8000');

function Message() {
  const [message, setMessage] = useState('');
  const sendMessage = () => {
    console.log(`User sent message : ${message}`);
    socket.emit('message', message);
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log(`User received message : ${data}`);
    });
  }, []);

  return (
    <div className='center'>
      <input
        placeholder='Message...'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
}

export default Message;
