const express = require("express");
const dotenv = require("dotenv");
var cors = require('cors');
const { Server } = require("socket.io");


const port = 8880;
const app = require('express')();
app.use(cors());

let users = [];
const addUser = (userId, socketId)=> {
  !users.some((user)=> user.userId === userId) &&
   users.push({userId, socketId});
}
const removeUser  = (socketId)=> {
  users = users.filter(user=> user.socketId !== socketId);
}
let findUser = (userId)=> {
  return users.find(user=> user.userId === userId);
}


const server = require('http').createServer(app);
const io = require('socket.io')(server, {cors: {origin: "*"}});
io.on('connection', (socket) => {
    console.log("a user connected");
    socket.on('addUser',(userId)=> {
      addUser(userId, socket.id);
      io.emit('getUsers', users);
    } )
    socket.on('disconnect', function(){
        console.log('User Disconnected');
        removeUser(socket.id);
        setTimeout(()=> {
          io.emit('getUsers', users);
        }, 750)
       
      });
      socket.on('sendMessage',({senderId, receiverId, newMessage})=> {
        console.log(senderId);
        console.log(receiverId);
          let user = findUser(receiverId);
          io.to(user?.socketId).emit('getMessage', {
            senderId,
            newMessage
          });
      })
});

server.listen(port);

const path = require("path")
app.use(express.urlencoded({ extended: false }));
app.use(express.json());




dotenv.config({path: './config.env'});
var cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use('/uploads/',express.static('uploads'));
require("./db/db.js");
app.use("/api", require(path.join(__dirname, "./apis/api.js")));

//server frontend
console.log("hello");

  console.log("hello");
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res)=> {
    res.sendFile(path.resolve(__dirname, '../','client', 'build', 'index.html'));
  })



// app.listen(port, ()=> {console.log(`listening at port ${port}`)});