const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const { promisify } = require('util');
const AppError = require('./utils/appError');
const User = require('./models/userModel');

const online_agents = [];

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err);
  process.exit(1);
});

dotenv.config({
  path: './config.env',
});
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB CONNECTED SUCCESSFULLY!');
  });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access', 401)
      );
    }
    // 2) Verification of token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to the token does not exist', 401)
      );
    }
    if (currentUser.role === 'agent') {
      if (!online_agents.includes(socket.id)) {
        online_agents.push(socket.id);
        console.log(online_agents);
      }
    }
    socket.userID = currentUser.userID;
    next();
  } catch (err) {
    console.log(err);
  }
});

io.on('connection', (socket) => {
  socket.on('customer_message', (data) => {
    for (let agent of online_agents) {
      console.log(`Sending message to ${agent}`);
      socket.to(agent).emit('customer_message', data);
    }
  });
  socket.on('disconnect', () => {
    console.log(`Client disconnected : ${socket.id}`);
    const index = online_agents.indexOf(socket.userID);
    if (index > -1) {
      online_agents.splice(index, 1);
    }
  });
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message, err.code);
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
