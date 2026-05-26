const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Ambil file index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

let players = {};

io.on("connection", (socket) => {

    console.log("Player masuk:", socket.id);

    socket.on("newPlayer", (data) => {

        players[socket.id] = data;

        socket.emit("allPlayers", players);

        socket.broadcast.emit("playerJoined", {
            id: socket.id,
            ...data
        });
    });

    socket.on("move", (data) => {

        players[socket.id] = data;

        io.emit("playerMoved", {
            id: socket.id,
            ...data
        });
    });

    socket.on("disconnect", () => {

        delete players[socket.id];

        io.emit("playerLeft", socket.id);

        console.log("Player keluar");
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("Server jalan di port " + PORT);
});
