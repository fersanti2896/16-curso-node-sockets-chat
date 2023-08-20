const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const generarJWT = ( uid = '' ) => {
    return new Promise(( resolve, reject ) => {
        const payload = { uid };

        jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '12h'
        }, (err, token) => {
            if(err) {
                console.log(err);

                reject( 'No se puedo generar el token.' );
            } else {
                resolve( token );
            }
        } )
    });
}

const comprobarJWT = async( token = '' ) => {
    try {
        if( token.length < 10 ) {
            return null;
        }

        const { uid } = jwt.verify( token, process.env.SECRET_KEY );
        const usuario = await Usuario.findById( uid );

        return ( usuario ) ? usuario.status ? usuario : null 
                           : null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {
    comprobarJWT,
    generarJWT
}