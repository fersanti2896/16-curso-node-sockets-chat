
const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSingIn } = require('../controller/authController');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post( '/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], login );

router.post( '/google', [
    check('id_token', 'Token de Google es necesario.').not().isEmpty(),
    validarCampos
], googleSingIn );

module.exports = router;