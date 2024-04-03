

const express = require('express');
const next = require('next');
const http = require('http');
const socketIO = require('socket.io');

// Setup the Next app
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    const httpServer = http.createServer(server);
    const io = socketIO(httpServer, {
        cors: {
            origin: "*", 
        }
    });
    io.on('connection', (socket) => {
        console.log('Client connected');
        socket.on('message1', (data) => {
            console.log('Received from API ::', data);
            io.emit('message2', data);
        });
    });
    server.all('*', (req, res) => {
        return handle(req, res);
    });

    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
