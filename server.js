const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

let players = {};

io.on("connection",(socket)=>{

    console.log("Player masuk:",socket.id);

    socket.on("newPlayer",(data)=>{

        players[socket.id] = data;

        io.emit("playerJoined",{
            id:socket.id,
            ...data
        });

        socket.emit("allPlayers",players);
    });

    socket.on("move",(data)=>{

        players[socket.id] = data;

        io.emit("playerMoved",{
            id:socket.id,
            ...data
        });
    });

    socket.on("disconnect",()=>{

        delete players[socket.id];

        io.emit("playerLeft",socket.id);

        console.log("Player keluar");
    });
});

server.listen(3000,()=>{

    console.log("Server jalan di port 3000");
});
