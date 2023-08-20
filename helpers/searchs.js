const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');

const buscarUsuario = async( termino = '', res = response ) => {
    const isMongoId = ObjectId.isValid( termino );

    if( isMongoId ) {
        const usuario = await Usuario.findById(termino);

        return res.status(200).json({
            results: usuario ? [ usuario ] : []
        }); 
    }

    const regex = new RegExp( termino, 'i' );
    const usuarios = await Usuario.find({ 
        $or: [ { name: regex }, { email: regex } ],
        $and: [ { status: true } ]
    });

    res.status(200).json({
        results: usuarios
    }); 
}

const buscarCategorias = async( termino = '', res = response ) => {
    const isMongoId = ObjectId.isValid( termino );

    if( isMongoId ) {
        const categoria = await Categoria.findById(termino);

        return res.status(200).json({
            results: categoria ? [ categoria ] : []
        }); 
    }

    const regex = new RegExp( termino, 'i' );
    const categorias = await Categoria.find({ name: regex, status: true });

    res.status(200).json({
        results: categorias
    }); 
}

const buscarProductos = async( termino = '', res = response ) => {
    const isMongoId = ObjectId.isValid( termino );

    if( isMongoId ) {
        const producto = await Producto.findById(termino);

        return res.status(200).json({
            results: producto ? [ producto ] : []
        }); 
    }

    const regex = new RegExp( termino, 'i' );
    const productos = await Producto.find({ 
        $or: [ { name: regex }, { description: regex } ],
        $and: [ { status: true } ]
    });

    res.status(200).json({
        results: productos
    }); 
}

module.exports = {
    buscarCategorias,
    buscarProductos,
    buscarUsuario
}