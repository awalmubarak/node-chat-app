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

    socket.on('disconnect', () => {
        console.log('Connection was lost');

    });
    
});
server.listen(port, ()=>{
    console.log('App running on port ' + port);
    
});