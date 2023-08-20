
const { Router } = require('express');
const { check } = require('express-validator');

const { usuariosGET, usuariosPOST, usuariosPUT, usuariosDELETE } = require('../controller/usuariosController');
const { isRoleValid, isEmailExists, existsUserById } = require('../helpers/db-validators');
const { validarCampos, validarJWT, haveRole } = require('../middlewares/index');

const router = Router();

router.get('/', usuariosGET);

router.post('/', [
    check('name', 'El nombre es obligatorio.').not().isEmpty(),
    check('email').custom( isEmailExists ),
    check('password', 'La contraseña debe ser más de 6 caracteres.').isLength(6),
    // check('role', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom( isRoleValid ),
    validarCampos
], usuariosPOST);

router.put('/:id', [
    check('id', 'No es un Id válido').isMongoId(),
    check('id').custom( existsUserById ),
    check('role').custom( isRoleValid ),
    validarCampos
], usuariosPUT);

router.delete('/:id', [
    validarJWT,
    // isAdminRole,
    haveRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un Id válido').isMongoId(),
    check('id').custom( existsUserById ),
    validarCampos
], usuariosDELETE);

module.exports = router;