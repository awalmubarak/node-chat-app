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

socket.on('newLocationMessage', function (message) {
    console.log(message);
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My Location</a>');
    a.attr('href', message.url);
    li.text(`${message.from}:`);
    li.append(a);
    jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();
    socket.emit('createMessage', {
        from:'Borga', text: jQuery('[name=message]').val()
    }, (res)=>{
        console.log(res);
    });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function(e){
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
    }
    navigator.geolocation.getCurrentPosition(function(position){
        console.log(position);
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude:position.coords.longitude
        });
    }, function(e){
        alert('unable to fetch location');
    });
});