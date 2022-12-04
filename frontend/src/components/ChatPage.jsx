import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

const ChatPage = ({ socket }) => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const messageRef = useRef();

  const sendMessage = () => {
    console.log('sending message');
    if (socket) {
      socket.emit('customer_message', {
        message: messageRef.current.value,
        conversationId: id,
      });
      console.log('message sent');
      messageRef.current.value = '';
    }
  };

  return (
    <>
      <h1>Messages : </h1>
      <div>
        {messages.map((message) => (
          <div key={message._id}>
            <p>{message.message}</p>
          </div>
        ))}
      </div>

      <input
        type='text'
        name='message'
        ref={messageRef}
        placeholder='Say Something!'
      />
      <button onClick={sendMessage}>Send</button>
    </>
  );
};

export default ChatPage;
