#!/usr/bin/env node

/**
 * Module dependencies.
 */

const app = require('../app');
const debug = require('debug')('chat:server');
const http = require('http');
const socketIO = require('socket.io');

const Mensaje = require('../models/mensaje.model');

/// configuramos .env
require('dotenv').config();

/// configumaos DB

require('../config/db');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/// configuracion del servidor WS
/// por aqui entra la comunicacion con el usuario a nuestro servidor

const io = socketIO(server);

io.on('connection', (socket) => {  
    // emite a todos menos al emisor
    socket.broadcast.emit('mensaje_chat', {   
      nombre: 'INFO',
      mensaje: 'Se ha conectado un nuevo usuario al servidor'
    }); 

    /// cuenta los clientes conectados
    io.emit('usuarios_chat', io.engine.clientsCount)

    socket.on('mensaje_chat', async (body) => {   /// escucha un evento en concreto
        await  Mensaje.create(body);  // guarda el mensaje en la DB
        io.emit('mensaje_chat', body)  /// rebota el mensaje hacia todos los clientes
    }); 
    
    /// controlamos los clientes deconectados y actualizamos el contador
    socket.on('disconnect', () => {
      io.emit('mensaje_chat', {
        nombre: 'INFO',
        mensaje: `Se ha desconectado un usuario`
      });
      io.emit('usuarios_chat', io.engine.clientsCount)
    });

});



/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
