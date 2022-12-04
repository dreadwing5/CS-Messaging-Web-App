import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import io from 'socket.io-client';

const ChatRoomPage = () => {
  useEffect(() => {
    const socket = io('http://localhost:8000', {
      auth: {
        token: localStorage.getItem('token'),
      },
    });
  }, []);

  // const { converSationId } = useParams();
  return <div>Chat Room Page</div>;
};

export default ChatRoomPage;
