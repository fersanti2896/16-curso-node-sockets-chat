
let usuario = null;
let socket = null;

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
    const socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });
}

const main = async() => {
    await validarJWT();
}

main();