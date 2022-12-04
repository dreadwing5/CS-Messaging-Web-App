import { useState } from 'react';
import Message from './Message.jsx';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [isAuth, setIsAuth] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });
      const data = await response.json();
      if (data.status === 'success') {
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
        <Message />
      ) : (
        <form style={styles}>
          <label className='label' htmlFor='email'>
            Email :{' '}
          </label>
          <input
            type='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleClick}>Click</button>
        </form>
      )}
    </div>
  );
}

export default App;
