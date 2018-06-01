const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

var app = express();
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var server = http.createServer(app);
var io = socketIO(server);


app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('Connection established');

    socket.emit('newMessage', {from:'Admin',
     text:'welcome to the chat app'});
    socket.broadcast.emit('newMessage', { from: 'Admin',
     text: 'New User joined' });

    socket.on('createMessage', (message) => {
        console.log(message);
        io.emit('newMessage', {from:message.from,
             text:message.text,
             createdAt:new Date().getTime()
            });

    });


    socket.on('disconnect', () => {
        console.log('Connection was lost');

    });
    
});
server.listen(port, ()=>{
    console.log('App running on port ' + port);
    
});