const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 4000;

const users = [];
const rooms = [];

io.on('connection', (socket) => {
    socket.on("join", (name, roomName) => {

        let user = users.find(user => user.id ===  socket.id)
        
        const userIdExists = users.some(user => user.id === socket.id);
        const userNameExists = users.some(user => user.name === name);
        
        if (!user) {
            const user = {id: socket.id, name, rooms: [roomName]};
            users.push(user);

            console.log(`Novo usuário ${name} entrou na sala ${roomName}`);
            
            
        } else {
            
            if  (!user.rooms.includes(roomName)) {
                user.rooms.push(roomName);
                console.log(`${name} criou sala ${roomName}`);
            }    
        }

        socket.join(roomName);
        
        if (!rooms.includes(roomName)) {
            rooms.push(roomName);
        }

                
            io.to(roomName).emit("users", users);
            io.to(roomName).emit("rooms", rooms);    

            console.log(users)     
            console.log(rooms)
    }); 





    
    socket.on("message", (message, name, roomName) => {
        io.emit("message", message, name, roomName);

        console.log(name)
    });

    socket.on("disconnect", () => {


    });
})

server.listen(port, () => console.log(`servidor rodando na porta ${port}`))