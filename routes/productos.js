const { Router } = require('express');
const { check } = require('express-validator');
const { productosAll, productoById, productoCreate, productoUpdate, productoDelete } = require('../controller/productosController');
const { validarJWT, validarCampos, isAdminRole } = require('../middlewares');
const { existsCategoriaById, existsProductoById, existsProductoByNombre } = require('../helpers/db-validators');

const router = Router();

/* Todos los productos */
router.get('/', productosAll);

/* Producto por id */
router.get('/:id', [ 
    check('id', 'No es un id de Mongo válido.').isMongoId(),
    check('id').custom( existsProductoById ),
    validarCampos
], productoById);

/* Crear producto por token */
router.post('/', [
    validarJWT,
    check('name', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('description', 'La descripción del producto es obligatorio').not().isEmpty(),
    check('categoria').custom( existsCategoriaById ),
    validarCampos
], productoCreate);

/* Actualiza la producto por token */
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo válido.').isMongoId(),
    check('id').custom( existsProductoById ),
    check('name', 'El nombre del producto es obligatorio').not().isEmpty(),
    existsProductoByNombre,
    check('categoria', 'La categoria es obligatorio').not().isEmpty(),
    check('categoria').custom( existsCategoriaById ),
    validarCampos
], productoUpdate);

/* Elimina una producto si es un admin */
router.delete('/:id', [
    validarJWT,
    isAdminRole,
    check('id', 'No es un id de Mongo válido.').isMongoId(),
    check('id').custom( existsProductoById ),
    validarCampos
], productoDelete);

module.exports = router;