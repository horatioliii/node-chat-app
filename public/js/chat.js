let socket = io();

function scrollToBottom () {
    // Selectors
    let messages = jQuery('#messages');
    let newMessage = messages.children('li:last-child');
    // Heights
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
};

function messageChecker (message) {
    const keywords = ['aima', 'Aima', 'Emma', 'emma', 'yiwei', 'Yi Wei', 'yi wei', 'anjila', '安吉拉', 'gyq', 'GYQ', 'Gyq'];
    const keywordsLen = keywords.length;
    for (let i=0; i < keywordsLen; i++) {
        message = message.replace(keywords[i], keywords[i].substring(0, 1).concat('**').concat(keywords[i].slice(-1)));
    }
    return message;
}

socket.on('connect', function () {
    let params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        }
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {
    let ol = jQuery('<ol></ol>');

    users.forEach(function (user) {
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
});

socket.on('newMessage', function (message) {
    let cleanMessage = messageChecker(message.text);
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let params = jQuery.deparam(window.location.search);
    let template = jQuery('#message-template').html();
    let senderTemplate = jQuery('#message-sender-template').html();
    if (message.from === params.name) {
        let html = Mustache.render(senderTemplate, {
            text: cleanMessage,
            from: message.from,
            createdAt: formattedTime
        });

        jQuery('#messages').append(html);
        scrollToBottom();
    } else {
        let html = Mustache.render(template, {
            text: message.text,
            from: message.from,
            createdAt: formattedTime
        });

        jQuery('#messages').append(html);
        scrollToBottom();
    }
});

socket.on('newLocationMessage', function (message) {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let params = jQuery.deparam(window.location.search);
    let template = jQuery('#location-message-template').html();
    let senderTemplate = jQuery('#location-message-sender-template').html();
    if (message.from === params.name) {
        let html = Mustache.render(senderTemplate, {
            url: message.url,
            from: message.from,
            createdAt: formattedTime
        });
        jQuery('#messages').append(html);
        scrollToBottom();
    } else {
        let html = Mustache.render(template, {
            url: message.url,
            from: message.from,
            createdAt: formattedTime
        });
        jQuery('#messages').append(html);
        scrollToBottom();
    }
});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    let messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val('');
    });
});

let locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }

    locationButton.attr('disabled', 'disabled').text('Sending Location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        locationButton.removeAttr('disabled').text('Send Location');
        alert('Unable to fetch location.');
    });
});