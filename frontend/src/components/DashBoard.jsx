import react from 'react';
import { Link } from 'react-router-dom';

function DashBoard() {
  //create dashboard with logout button and user id on top

  return (
    <div>
      <h1>Dashboard</h1>
      {/* <p> Welcome, {userID}</p> */}
      <Link to='/chatroom/123'>Chat with us</Link>
    </div>
  );
}

export default DashBoard;
