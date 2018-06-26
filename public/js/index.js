let socket = io();

socket.on('connect', function () {
    console.log('connected to server');

    socket.emit('createMessage', {
        From: 'shuanghao@gmail.com',
        text: 'Haha'
    });
});

socket.on('disconnect', function () {
   console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
    console.log('New message', message);
});