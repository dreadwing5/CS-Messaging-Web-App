import DashBoard from './components/DashBoard.jsx';
import Login from './components/Login.jsx';
import Home from './components/Home.jsx';
import ChatRoom from './components/ChatRoomPage.jsx';
import { Routes, Route, useNavigate } from 'react-router-dom';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<DashBoard />} />
        <Route path='/chatroom/:id' element={<ChatRoom />} />
      </Routes>
    </div>
  );
}

export default App;
