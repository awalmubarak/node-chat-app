var socket = io();
socket.on('connect', function () {
    console.log('Connection Established');
});

socket.on('disconnect', function () {
    console.log('Connection Lost');
});

socket.on('newMessage', function (message) {
    console.log(message);
});