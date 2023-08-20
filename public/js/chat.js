
let usuario = null;
let socket = null;

const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');

/* Valida el token del localstorage */
const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';

    if( token.length <= 10 ) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor'); 
    } 

    const resp = await fetch( 'http://localhost:5796/api/auth/renovar-token', {
        headers: { 'x-token': token }
    } );

    const { usuario: userDB, token: tokenDB } = await resp.json();
    console.log(userDB, tokenDB);

    localStorage.setItem( 'token', tokenDB );
    usuario = userDB;

    document.title = usuario.name;

    await conectarSocket();
}

const conectarSocket = async() => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets Online')
    });

    socket.on('disconnect', () => {
        console.log('Sockets Offline')
    });

    socket.on('recibir-mensajes', () => {
        // TODO: Falta recibir el mensajes
    });

    socket.on('usuarios-activo', () => {
        // TODO: Usuarios Activos
    });

    socket.on('mensaje-privado', () => {
        // TODO: Mensaje privado
    });
}

const main = async() => {
    await validarJWT();
}

main();