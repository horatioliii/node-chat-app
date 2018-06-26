const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io')

const publicPath = path.join(__dirname + '/../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('newMessage', {
        from: 'John',
        text: 'Hello',
        createAt: 123
    });

    socket.on('createMessage', (message) => {
        console.log(`createMessage${JSON.stringify(message)}`)
    });

    socket.on('disconnect', (socket) => {
        console.log('User was disconnected');
    });
});

server.listen(port, () => {
    console.log('server is up port 3000');
});