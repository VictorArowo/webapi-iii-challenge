const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const userRouter = require('./users/userRouter');

const server = express();
server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(logger);

server.use(userRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

function logger(req, res, next) {
  console.log(
    `${req.method} method was called on ${
      req.url
    } at ${new Date().toLocaleTimeString()}`
  );
  next();
}

module.exports = server;
