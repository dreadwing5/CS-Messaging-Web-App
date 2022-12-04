const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const { promisify } = require('util');
const AppError = require('./utils/appError');
const User = require('./models/userModel');

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
    console.log(token);
    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access', 401)
      );
    }
    // 2) Verification of token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);
    const currentUser = await User.findById(decoded.id);
    console.log(currentUser);
    // if (!currentUser) {
    //   return next(
    //     new AppError('The user belonging to the token does not exist', 401)
    //   );
    //   next();
  } catch (err) {
    console.log(err);
  }
});

io.on('connection', (socket) => {
  console.log(`New client connected : ${socket.id}`);

  socket.on('message', (data) => {
    console.log(data);
    socket.broadcast.emit('receive_message', data);
  });
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message, err.code);
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
