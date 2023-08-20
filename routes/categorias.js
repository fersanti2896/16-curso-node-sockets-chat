const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, haveRole, isAdminRole } = require('../middlewares');
const { categoriasAll, categoriaById, categoriaCreate, categoriaUpdate, categoriaDelete } = require('../controller/categoriasController');
const { existsCategoriaById, existsCategoriaByNombre } = require('../helpers/db-validators');

const router = Router();

router.get('/', categoriasAll);

/* Categoria por id */
router.get('/:id', [
    check('id', 'No es un id de Mongo válido.').isMongoId(),
    check('id').custom( existsCategoriaById ),
    validarCampos
], categoriaById);

/* Crear categoria por token */
router.post('/', [
    validarJWT,
    check('name', 'El nombre de la categoria es obligatorio').not().isEmpty(),
    validarCampos
], categoriaCreate);

/* Actualiza la categoria por token */
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo válido.').isMongoId(),
    check('id').custom( existsCategoriaById ),
    check('name', 'El nombre de la categoria es obligatorio').not().isEmpty(),
    existsCategoriaByNombre,
    validarCampos
], categoriaUpdate);

/* Elimina una categoria si es un admin */
router.delete('/:id', [
    validarJWT,
    isAdminRole,
    check('id', 'No es un id de Mongo válido.').isMongoId(),
    check('id').custom( existsCategoriaById ),
    validarCampos
], categoriaDelete);

module.exports = router;