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

    socket.emit('ActiveGroups', users.getActiveRooms());

    socket.on('join',(params, callback)=>{
        var room = params.room;
        if (params.selectRoom !=='') room =params.selectRoom;
        if(!isRealString(params.name) || !isRealString(room)){
            return callback('Display name and Room name is reqired');
        }
        if (params.name.toLowerCase()==='admin') {
            return callback('Display name cannot be "Admin"');
        }
        var user = users.getUserByName(params.name.toLowerCase());
        if (user && user.room === room.toLowerCase()) {
            return callback(`Username "${params.name}" is taken in this room, please choose another name`);
        }
        socket.join(room.toLowerCase());
        users.addUser(socket.id, params.name.toLowerCase(), room.toLowerCase());
        socket.emit('newMessage', generateMessage('Admin', `welcome to room '${room}'`));
        socket.broadcast.to(room.toLowerCase()).emit('newMessage', generateMessage('Admin', `${params.name} just joined.`));
        io.to(room.toLowerCase()).emit('updateUserList', users.getUserList(room.toLowerCase()));
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);
        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));            
        }
        callback();
    });

    socket.on('createLocationMessage', (cords)=>{
        var user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, cords.latitude, cords.longitude));
        }
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