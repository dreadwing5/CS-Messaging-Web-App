const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Message = require('../models/messageModel');

dotenv.config({
  path: '../config.env',
});

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

//Read JSON file

const messages = JSON.parse(
  fs.readFileSync(`${__dirname}/message-data.json`, 'utf-8')
);

const date = new Date();
const importData = async () => {
  try {
    for (const [key, values] of Object.entries(messages)) {
      for (const val of values) {
        const message = {
          text: val.message,
          sendTime: new Date(val.timeStamp),
          conversationId: key,
          sendStatus: 0,
          senderId: key,
        };
        await Message.create(message);
      }
    }
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
};

//Delete all data from db

const deleteData = async () => {
  try {
    await Message.deleteMany();
    console.log('Data successfully deleted!');
    process.exit();
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
};

if (process.argv[2] === '--import') importData();

if (process.argv[2] === '--delete') deleteData();
