
const { Router } = require('express');
const { check } = require('express-validator');
const { uploadFileServer, updateImageCloudinary, viewImg } = require('../controller/uploadsController');
const { validarCampos, validarArchivo } = require('../middlewares');
const { coleccionesPermitidas } = require('../helpers');

const router = Router();

router.post('/', validarArchivo, uploadFileServer);

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'El id debe ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos', 'categorias']) ),
    validarCampos
], updateImageCloudinary);

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos', 'categorias']) ),
    validarCampos
], viewImg);

module.exports = router;