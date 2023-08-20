const { Router } = require('express');
const { check } = require('express-validator');
const { search } = require('../controller/searchController');
const { validarJWT } = require('../middlewares');

const router = Router();

router.get('/:coleccion/:termino', [
    validarJWT
], search);

module.exports = router;