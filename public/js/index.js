var socket = io();
socket.on('connect', function () {
    console.log('Connection Established');
});

socket.on('disconnect', function () {
    console.log('Connection Lost');
});

socket.on('newMessage', function (message) {
    var time = moment(message.createdAt).format('h:mm a');
    var li = jQuery('<li></li>');
    li.text(`${message.from} ${time}: ${message.text}`);
    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
    var time = moment(message.createdAt).format('h:mm a');
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My Location</a>');
    a.attr('href', message.url);
    li.text(`${message.from} ${time}:`);
    li.append(a);
    jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function(e){
    var messageTextBox = jQuery('[name=message]');
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'Borga', text: messageTextBox.val()
    }, ()=>{
        messageTextBox.val('');
    });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function(e){
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
    }
    locationButton.attr('disabled','disabled').text('Sending location...');
    navigator.geolocation.getCurrentPosition(function(position){
        console.log(position);
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude:position.coords.longitude
        });
    }, function(e){
        locationButton.removeAttr('disabled').text('Send location');
        alert('unable to fetch location');
    });
});