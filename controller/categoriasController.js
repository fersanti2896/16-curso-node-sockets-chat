const { response } = require('express');
const { Categoria } = require('../models');

const categoriasAll = async(req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    
    const [ total, categorias ] = await Promise.all([ 
        Categoria.countDocuments({ status: true }),
        Categoria.find({ status: true })
                 .limit( Number(limite) )
                 .skip( Number(desde) )
                 .populate('usuario', 'name')
    ]);

    res.status(200).json({
        total, 
        categorias
    });
}

const categoriaById = async(req, res = response) => {
    const { id } = req.params;

    const categoria = await Categoria.findById( id )
                                     .populate('usuario', 'name');

    res.status(200).json({
        categoria
    });
}

const categoriaCreate = async(req, res = response) => {
    const name = req.body.name.toUpperCase();
    
    try {
        const categoriaDB = await Categoria.findOne({ name });

        if( categoriaDB ) {
            return res.status(400).json({
                msg: `La categoria ${ categoriaDB.name } ya existe.`
            })
        }

        /* Se genera la data a guardar */
        const dataCategoria = {
            name,
            usuario: req.usuario.id
        }

        const categoria = new Categoria( dataCategoria );
        /* Se guarda en DB */
        await categoria.save();

        res.status(201).json({
            categoria
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            msg: 'Hable con el administrador.'
        });
    }
}

const categoriaUpdate = async(req, res = response) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const categoria = await Categoria.findByIdAndUpdate( id, { name: name.toUpperCase() }, { new: true });

        res.status(200).json({
            categoria
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: 'Hable con el administrador.'
        });
    }
}

const categoriaDelete = async(req, res = response) => {
    const { id } = req.params;

    try {
        /* Hacemos borrado lógico */
        const categoria = await Categoria.findByIdAndUpdate( id, { status: false }, { new: true })

        res.status(200).json({
            categoria
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: 'Hable con el administrador.'
        });
    }
}

module.exports = {
    categoriasAll,
    categoriaById,
    categoriaCreate,
    categoriaUpdate,
    categoriaDelete
}