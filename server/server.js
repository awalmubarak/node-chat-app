const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);


app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('Connection established');

    socket.emit('newMessage', generateMessage('Admin', 'welcome to the chat app'));
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User joined'));

    socket.on('createMessage', (message, callback) => {
        console.log(message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('From server');
    });


    socket.on('disconnect', () => {
        console.log('Connection was lost');

    });
    
});
server.listen(port, ()=>{
    console.log('App running on port ' + port);
    
});