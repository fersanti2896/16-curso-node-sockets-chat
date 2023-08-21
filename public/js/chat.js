
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

    socket.on( 'recibir-mensajes', () => {
        // TODO: Falta recibir el mensajes
    } );

    socket.on( 'usuarios-activos', dibujarUsuarios );

    socket.on( 'mensaje-privado', () => {
        // TODO: Mensaje privado
    } );
}

const dibujarUsuarios = ( usuarios = [] ) => {
    let userHTML = '';
    usuarios.forEach( ({ name, uid }) => {
        userHTML += `
            <li>
                <p>
                    <h5 class="text-success">${ name }</h5>
                    <span class="fs-6 text-muted">${ uid }</span>
                </p>
            </li>
        `;
    } );

    ulMensajes.innerHTML = userHTML;
}

const main = async() => {
    await validarJWT();
}

main();