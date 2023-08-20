const path = require('path');
const fs = require('fs');
const { response } = require('express');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL )

const { uploadFile } = require('../helpers');
const { Usuario, Producto } = require('../models');

const uploadFileServer = async(req, res = response) => {
    try {
        /* Validamos la extensión */
        // const extensionValidas = ['txt', 'pdf'];

        const nombreImg = await uploadFile( req.files, undefined, 'imgs' );

        res.status(201).json({
            nombreImg
        });
    } catch (msg) {
        console.log(msg);

        res.status(400).json({
            msg
        });
    }   
}

/* Función para fines informativos */
const updateImage = async(req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById( id );

            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }.`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById( id );
    
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }.`
                });
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto.' })
    }

    /* Limpiar imagen previa */
    try {
        if( modelo.img ) {
            // Borrar la imagen del servidor
            const pathImg = path.join( __dirname, '../uploads', coleccion, modelo.img );

            if( fs.existsSync(pathImg) ) {
                fs.unlinkSync( pathImg );
            }
        }
    } catch (error) {
        console.log(error);
    }

    const nombre = await uploadFile( req.files, undefined, coleccion );
    modelo.img = nombre;

    await modelo.save();

    res.status(200).json({
        modelo
    });
}

const viewImg = async(req, res = response) => {
    const { coleccion, id } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById( id );

            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }.`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById( id );
    
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }.`
                });
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto.' })
    }

    if( modelo.img ) {
        const pathImg = path.join( __dirname, '../uploads', coleccion, modelo.img );

        if( fs.existsSync(pathImg) ) {
            return res.sendFile( pathImg );
        }
    }

    const pathImg = path.join( __dirname, '../assets/no-image.jpg' )
    res.sendFile( pathImg );
}

const updateImageCloudinary = async(req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById( id );

            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }.`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById( id );
    
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }.`
                });
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto.' })
    }

    /* Limpiar imagen previa */
    if( modelo.img ) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');

        cloudinary.uploader.destroy( public_id );
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath )

    modelo.img = secure_url;
    await modelo.save();

    res.status(200).json({
        modelo
    });
}

module.exports = {
    updateImage,
    updateImageCloudinary,
    uploadFileServer,
    viewImg
}