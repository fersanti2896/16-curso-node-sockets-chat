const { Socket } = require('socket.io');
const { comprobarJWT } = require('../helpers');
const { ChatMensajes } = require('../models');

const chatMensajes = new ChatMensajes();

const socketController = async( socket = new Socket(), io ) => {
    // console.log('Cliente conectado', socket.id)
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);

    if( !usuario ) {
        return socket.disconnect();
    }

    // console.log( 'Se conectó', usuario.name );
    /* Agregar el usuario conectado */
    chatMensajes.conectarUsuario( usuario );
    io.emit( 'usuarios-activos', chatMensajes.usuarioArr );

    /* Limpiar cuando alguien se desconecta */
    socket.in('disconnect', () => {
        chatMensajes.desconectarUsuario( usuario.id );
        io.emit( 'usuarios-activos', chatMensajes.usuarioArr );
    })
}

module.exports = {
    socketController
}