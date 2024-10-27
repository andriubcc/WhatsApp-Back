const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 4000;

const users = [];
const rooms = {};

io.on('connection', (socket) => {
    socket.on("join", (name, roomName) => {
        const user = {id: socket.id, name, roomName};
        users.push(user);

        socket.join(roomName);

        if (!rooms[roomName]) {
            rooms[roomName] = [];
        }
        rooms[roomName].push(name);


        io.emit("users", users)
        io.emit("room", Object.keys(rooms));
        console.log(`${name} entrou na ${roomName}`)
    });

    socket.on("leave", (roomName) => {
        socket.leave(roomName);
        console.log(`${socket.id} saiu da sala ${roomName}`);
    });
    
    socket.on("message", (messageData) => {
        io.to(messageData.roomName).emit("message", messageData);
    });

    socket.on("disconnect", () => {
        const index = users.findIndex(user => user.id === socket.id);
        if (index !== -1) {
            const user = users.splice(index, 1)[0];


            if (rooms[user.roomName]) {
                rooms[user.roomName] = rooms[user.roomName].filter(u => u !== user.name);
                

                if (rooms[user.roomName].length === 0) {
                    delete rooms[user.roomName];
                }
            }

            io.emit("users", users);
            io.emit("room", Object.keys(rooms));

            console.log(`${user.name} saiu da sala ${user.roomName}`);
        }
    });
})

server.listen(port, () => console.log(`servidor rodando na porta ${port}`))