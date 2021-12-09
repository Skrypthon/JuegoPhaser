let app = require("express")()
let http = require("http").Server(app)
let io = require("socket.io")(http)

// En cada nueva connecion
io.on('connection',(socket) => {
    console.log("Nueva conexion")

    socket.on('saltar', () => {
        socket.broadcast.emit('jugador-saltando') // Si un socket envio el evento saltar, 
        // entonces el socket hace un boradcast para anunciarlo a todos los clientes
    })
})

var port = 2525

// La aplicacion escucha en el puerto port
http.listen(port, function() {
    console.log("listening in http://localhost:"+port)
})