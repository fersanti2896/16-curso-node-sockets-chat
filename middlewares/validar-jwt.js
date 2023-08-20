const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async( req = request, res = response, next ) => {
    const token = req.header('x-token');
    
    if( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición.'
        });
    }

    try {
        const { uid } = jwt.verify( token, process.env.SECRET_KEY );

        /* El uid se pasa por referencia en la request. */
        req.uid = uid;

        /* Obteniendo la información del usuario autenticado */
        const usuario = await Usuario.findById( uid );

        if( !usuario ) {
            res.status(401).json({
                msg: 'Token no válido.'
            })
        }

        /* Varificando si el usuario no tiene estado en false */
        if( !usuario.status ) {
            res.status(401).json({
                msg: 'Token no válido.'
            });
        }

        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);

        res.status(401).json({
            msg: 'Token no válido.'
        });
    }
}

module.exports = {
    validarJWT
}