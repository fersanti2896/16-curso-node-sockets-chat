const { response } = require('express');
const { Producto } = require('../models');

const productosAll = async(req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    
    const [ total, productos ] = await Promise.all([ 
        Producto.countDocuments({ status: true }),
        Producto.find({ status: true })
                 .limit( Number(limite) )
                 .skip( Number(desde) )
                 .populate('usuario', 'name')
                 .populate('categoria', 'name')
    ]);

    res.status(200).json({
        total, 
        productos
    });
}

const productoById = async(req, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findById( id )
                                     .populate('usuario', 'name')
                                     .populate('categoria', 'name');

    res.status(200).json({
        producto
    });
}

const productoCreate = async(req, res = response) => {
    const { name, ...resto } = req.body;
    
    try {
        const productoDB = await Producto.findOne({ name: name.toUpperCase() });

        if( productoDB ) {
            return res.status(400).json({
                msg: `El producto ${ productoDB.name } ya existe.`
            })
        }

        /* Se genera la data a guardar */
        const dataProducto = {
            ...resto,
            name: name.toUpperCase(),
            usuario: req.usuario.id
        }

        const producto = new Producto( dataProducto );
        /* Se guarda en DB */
        await producto.save();

        res.status(201).json({
            producto
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            msg: 'Hable con el administrador.'
        });
    }
}

const productoUpdate = async(req, res = response) => {
    const { id } = req.params;
    const { name, ...resto } = req.body;

    try {
        /* Se genera la data a guardar */
        const dataProducto = {
            ...resto,
            name: name.toUpperCase(),
            usuario: req.usuario.id
        }

        const producto = await Producto.findByIdAndUpdate( id, dataProducto, { new: true } );

        res.status(200).json({
            producto
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: 'Hable con el administrador.'
        });
    }
}

const productoDelete = async(req, res = response) => {
    const { id } = req.params;

    try {
        /* Hacemos borrado lógico */
        const producto = await Producto.findByIdAndUpdate( id, { status: false }, { new: true });

        res.status(200).json({
            producto
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: 'Hable con el administrador.'
        });
    }
}

module.exports = {
    productosAll,
    productoById,
    productoCreate,
    productoDelete,
    productoUpdate
}
