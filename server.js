const express = require("express");

const path = require("path");
var cors = require('cors');
const { Server } = require("socket.io");
require('dotenv').config({ path: path.resolve(__dirname, './config.env') });

const port = 5000;
const app = require('express')();
app.use(cors());
const { saveIp} = require("./controllers/ipController");
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
    
    socket.on('addUser',(userId)=> {
      addUser(userId, socket.id);
      io.emit('getUsers', users);
    } )
    socket.on('disconnect', function(){
       
        removeUser(socket.id);
        setTimeout(()=> {
          io.emit('getUsers', users);
        }, 750)
       
      });
      socket.on('sendMessage',({senderId, receiverId, newMessage})=> {

          let user = findUser(receiverId);
          io.to(user?.socketId).emit('getMessage', {
            senderId,
            newMessage
          });
      });
      socket.on('calluser', ({userId, receiverId, data})=> {
        console.log('callerId');
        console.log(userId);
        console.log('endcalId');
        let user = findUser(receiverId);
        io.to(user?.socketId).emit('calluser', {
          callerId: userId,
          data
        });
      })
      socket.on('rejectedCall', ({from, to})=> {
        console.log('to: ' + to);
         let user = findUser(to);
         console.log('user: ' + user.socketId);
         io.to(user?.socketId).emit('rejectedCall', {
          from,
          to
         });
      });
      socket.on('callAccepted', ({callerid, receiverId, data})=> {
        let user = findUser(callerid);
        io.to(user?.socketId).emit('callAccepted', {
         callerid,
         receiverId,
         data: data
        });
      });
      socket.on('callEnded', ({from, to})=> {
        console.log('callerid');
        console.log(from);
        console.log('endcallerid')
        console.log(to);
        console.log('endcallerid');
        let user = findUser(to);
        io.to(user?.socketId).emit('callEnded', {from, to});
      })
});


app.use(express.urlencoded({ extended: false }));
app.use(express.json());





var cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use('/uploads/',express.static('uploads'));
require("./db/db.js");
app.use("/api",saveIp ,require(path.join(__dirname, "./apis/api.js")));

//clean files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
server.listen((process.env.PORT || port), ()=> {
  console.log(`server listenenig at port ${port} `);
});

