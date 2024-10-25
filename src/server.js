const express = require('express');
const http = require('http');
const soquetIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = soquetIo(server);

const port = process.env.PORT || 4000;

const users = [];

io.on('connection', (socket) => {
    socket.on("disconnect", () => {

    })
    socket.on("join", (name) => {
        const user = {id: socket.id, name};
        users.push(user);
        io.emit("users", users)
    })

    socket.on("message", (message) => {
        io.emit("message",message);
    })
})

server.listen(port, () => console.log(`servidor rodando na porta ${port}`))