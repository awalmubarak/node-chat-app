var socket = io();
socket.on('connect', function () {
    console.log('Connection Established');
});

socket.on('disconnect', function () {
    console.log('Connection Lost');
});

socket.on('newMessage', function (message) {
    console.log(message);
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', (e)=>{
    e.preventDefault();
    socket.emit('createMessage', {
        from:'Borga', text: jQuery('[name=message]').val()
    }, (res)=>{
        console.log(res);
    });
});