
const validarArchivo = require('../middlewares/validar-archivo');
const validarJWT = require('../middlewares/validar-jwt');
const validarCampos = require('../middlewares/validar-campos');
const isAdminRole = require('../middlewares/validar-roles');
const haveRole = require('../middlewares/validar-roles');

module.exports = {
    ...isAdminRole,
    ...haveRole,
    ...validarArchivo,
    ...validarCampos,
    ...validarJWT 
}