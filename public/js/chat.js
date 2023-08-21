
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

    socket.on( 'recibir-mensajes', dibujarMensaje );

    socket.on( 'usuarios-activos', dibujarUsuarios );

    socket.on( 'mensaje-privado', (payload) => {
        console.log('Mensaje privado:', payload)
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

    ulUsuarios.innerHTML = userHTML;
}

const dibujarMensaje = ( mensajes = [] ) => {
    let mensajesHTML = '';
    mensajes.forEach( ({ nombre, mensaje }) => {
        mensajesHTML += `
            <li>
                <p>
                    <span class="text-primary">${ nombre }</span>
                    <span>${ mensaje }</span>
                </p>
            </li>
        `;
    } );

    ulMensajes.innerHTML = mensajesHTML;
}

txtMensaje.addEventListener('keyup', ({ keyCode }) => {
    const mensaje = txtMensaje.value;
    const uid = txtUid.value;

    if( keyCode !== 13 ) { return; }
    if( mensaje.trim().length === 0 ) { return; }

    socket.emit('enviar-mensaje', { mensaje, uid });
    txtMensaje.value = '';
    txtUid.value = '';
});

const main = async() => {
    await validarJWT();
}

main();