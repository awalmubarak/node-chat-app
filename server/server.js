const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var users = new Users();
var app = express();
var server = http.createServer(app);
var io = socketIO(server);


app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('Connection established');

    socket.on('join',(params, callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Display name and Room name is reqired');
        }
        if (params.name.toLowerCase()==='admin') {
            return callback('Display name cannot be "Admin"');
        }
        socket.join(params.room);
        users.addUser(socket.id, params.name, params.room);
        socket.emit('newMessage', generateMessage('Admin', `welcome to room '${params.room}'`));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} just joined.`));
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        console.log(message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    });

    socket.on('createLocationMessage', (cords)=>{
        io.emit('newLocationMessage', generateLocationMessage('Borga',cords.latitude, cords.longitude));
    });


    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));            
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));            
        }
    });
    
});
server.listen(port, ()=>{
    console.log('App running on port ' + port);
    
});