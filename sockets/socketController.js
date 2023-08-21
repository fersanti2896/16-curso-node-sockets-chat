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
    /* Cuando se conecta un nuevo usuario, se le envian todos loe mensajes actuales */
    socket.emit( 'recibir-mensajes', chatMensajes.ultimoDiez );

    /* Si el usuario se quiere conectar a una sala especial - chat privado */
    socket.join( usuario.id );

    /* Limpiar cuando alguien se desconecta */
    socket.in('disconnect', () => {
        chatMensajes.desconectarUsuario( usuario.id );
        io.emit( 'usuarios-activos', chatMensajes.usuarioArr );
    });

    socket.on('enviar-mensaje', ({ mensaje, uid }) => {
        if( uid ) {
            /* Mensaje privado */
            socket.to( uid ).emit( 'mensaje-privado', { de: usuario.name, mensaje } );
        } else {
            chatMensajes.enviarMensaje( usuario.id, usuario.name, mensaje );
            io.emit('recibir-mensajes', chatMensajes.ultimoDiez);
        }
    });
}

module.exports = {
    socketController
}