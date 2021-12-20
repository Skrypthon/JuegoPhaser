let app = require("express")();
let http = require("http").Server(app);
let io = require("socket.io")(http);

var connections = 0;
var posPlayer1;
var one = false;
var two = false;
var dataId;
let readyPlayer;

// En cada nueva connecion
io.on("connection", (socket) => {
  console.log("Nueva conexion");
  var connectedUsersCount = io.engine.clientsCount; //Numero de usuarios conectados
  console.log("Numero de usarios" + connectedUsersCount);

  socket.emit("readyPlayer", connectedUsersCount); //envia a todos los players dependiendo de cuántos players están conectados s

  var escucha = escuchaPlayers(socket);

  socket.on("saltar", () => {
    socket.emit("jugador-saltando");
    // entonces el socket hace un boradcast para anunciarlo a todos los clientes
  });
  socket.on("posicion", (data) => {
    console.log("Me estan enviado la posicion");
    console.log(data.x + "   " + data.y);
    socket.broadcast.emit("posPlayer2", data);
  });
});

var port = 8080;

// La aplicacion escucha en el puerto port
http.listen(port, function () {
  console.log("listening in http://localhost:" + port);
});

function escuchaPlayers(socket) {
  socket.on("posPlayer1", (data) => {
    socket.broadcast.emit("posPlayer2", data);
  });
}
