import { useState } from 'react';
import Message from './components/Message.jsx';
import './App.css';

function App() {
  const [userID, setUserID] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [isAgent, setIsAgent] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID,
        }),
      });
      const res = await response.json();
      if (res.status === 'success') {
        if (res.data.user.role === 'agent') {
          setIsAgent(true);
        }
        setIsAuth(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const styles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  };

  return (
    <div className='App'>
      {isAuth ? (
        <Message userId={userID} />
      ) : (
        <form style={styles}>
          <label className='label' htmlFor='email'>
            UserID :
          </label>
          <input value={userID} onChange={(e) => setUserID(e.target.value)} />
          <button onClick={handleClick}>Click</button>
        </form>
      )}
    </div>
  );
}

export default App;
