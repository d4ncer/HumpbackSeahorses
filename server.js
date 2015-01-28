var port = process.env.PORT || 3000;
var express = require("express");
var app = express();

var http = require("http").Server(app);
var io = require('socket.io')(http);
var path = require('path');

var indexPage = path.resolve(__dirname + '/public');

app.use(express.static(indexPage));

var chatter = require('./server/ChatHandler.js');

io.on('connection', function(socket){
  //automatically connect new users to lobby
  socket.join('lobby');
  //join lobby in db, default to en for now
  chatter.joinRoom('lobby', 'en');

  //naive solution, custom variables to store last room
  //and user language. used for leaving rooms on disconnect
  //if users are implemented these should probably be in that model
  socket.currentRoom = 'lobby';
  socket.userLang = 'en';

  socket.on('disconnect', function(){
    //console.log('user disconnected');
    console.log(socket.currentRoom, socket.userLang);
    chatter.leaveRoom(socket.currentRoom, socket.userLang);
  });

  //translate and emit results using a callback on prepared messages
  socket.on('chat message', function(msg){
    chatter.prepareMessage(msg, function(){
      //emit message
      socket.join(msg.room);
      console.log('broadcasted message: ', msg);
      io.to(msg.room).emit('chat message', msg);
    });
  });

  // socket.on('leave room', function(data){
  //   // console.log(socket.adapter.rooms);
  //   socket.leave(data.leaveRoom);
  //   //leave room
  //   chatter.leaveRoom(data.leaveRoom, data.lang);
  // });

  socket.on('join room', function(msg){
    socket.leave(socket.currentRoom);
    socket.currentRoom = msg.room;

    socket.join(msg.room);

    chatter.joinRoom(msg.room, msg.lang);
    // console.log(socket.adapter.rooms);
    // console.log('enter room ->', room);
    // console.log(socket.adapter.rooms);
  });

});

http.listen(port, function(){
  console.log('listening on *:', port);
});