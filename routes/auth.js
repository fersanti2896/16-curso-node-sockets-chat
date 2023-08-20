
const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSingIn, renovarToken } = require('../controller/authController');
const { validarCampos, validarJWT } = require('../middlewares');

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

router.get( '/renovar-token', validarJWT, renovarToken );

module.exports = router;