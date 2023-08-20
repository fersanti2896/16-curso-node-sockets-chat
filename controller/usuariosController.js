
const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGET = async(req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;

    const [ total, usuarios ] = await Promise.all([ 
        Usuario.countDocuments({ status: true }),
        Usuario.find({ status: true })
                                  .limit( Number(limite) )
                                  .skip( Number(desde) )
    ]);

    res.status(200).json({
        total, 
        usuarios
    });
}

const usuariosPOST = async(req, res = response) => {
    const { name, email, password, role } = req.body;
    const usuario = new Usuario({ name, email, password, role });
    
    /* Encriptando la contraseña */
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );
    /* Se guarda en BD */    
    await usuario.save();

    res.status(200).json({
        usuario
    });
}

const usuariosPUT = async(req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, email, ...resto } = req.body;

    // TODO: Validar contra base de datos
    if( password ) {
        /* Encriptando la contraseña */
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    /* Actualiza el registro */
    const usuario = await Usuario.findByIdAndUpdate( id, resto, { new: true } );

    res.status(200).json({
        usuario
    });
}

const usuariosDELETE = async(req, res = response) => {
    const { id } = req.params;
    const uid = req.uid;

    /* Borrado físico, es decir, borra de BD */
    // const usuario = await Usuario.findByIdAndDelete(id);

    /* Borrado lógico */
    const usuario = await Usuario.findByIdAndUpdate( id, { status: false }, { new: true } );

    /* Obteniendo la información del usuario autenticado */
    // const usuarioAutenticado = req.usuario;

    res.status(200).json({
        usuario
    });
}

module.exports = {
    usuariosDELETE,
    usuariosGET,
    usuariosPOST,
    usuariosPUT
}