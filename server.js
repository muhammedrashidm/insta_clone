const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')


const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: '*'
    }
})

let users = []





const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};
const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    console.log('getUser:' + userId);
    return users.find((user) => user.userId === userId);
};


io.on('connection', socket => {
    console.log('user connected' + socket.id);
    io.emit('connected', socket.id)
    io.on('addUser', (userId) => {
        addUser(userId, socket.id);
        console.log('addUser:' + userId);
    })



    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        console.log(senderId + "--" + receiverId + "--" + text);
        const user = getUser(receiverId);
        io.to(user?.socketId).emit("getMessage", {
            senderId,
            text,
        });
        console.log("foundSocketId" + user?.socketId);
    });














    socket.on("disconnect", () => {
        console.log("a user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
})

httpServer.listen(8900);