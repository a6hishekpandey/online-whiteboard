const express = require("express"),
    path = require("path"),
    socket = require("socket.io"),
    app = express(),
    port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile("index");    
});

const server = app.listen(port, () => {
    console.log(`Server started on port ${port}.`);
});

let io = socket(server);

io.on("connection", (socket) => {
    socket.on("beginPath", (data) => {
        io.sockets.emit("beginPath", data);
    });

    socket.on("drawPath", (data) => {
        io.sockets.emit("drawPath", data);
    });

    socket.on("undoRedoFn", (data) => {
        io.sockets.emit("undoRedoFn", data);
    });
});