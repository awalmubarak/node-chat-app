var socket = io();

function scrollToBottom() {
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var prevMessageHeight = newMessage.prev().innerHeight();
    
    if ((clientHeight + scrollTop + newMessageHeight + prevMessageHeight)>=scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}
socket.on('connect', function () {
    console.log('Connection Established');
});

socket.on('disconnect', function () {
    console.log('Connection Lost');
});

socket.on('newMessage', function (message) {
    var time = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        from: message.from, text: message.text, createdAt: time
    });
    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
    var time = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from, url: message.url, createdAt: time
    });
    jQuery('#messages').append(html);
    scrollToBottom();
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