const { response } = require('express');
const { buscarUsuario, buscarCategorias, buscarProductos } = require('../helpers/searchs');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const search = (req, res = response) => {
    const { coleccion, termino } = req.params;

    if( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuario( termino, res );
            break;
        case 'categorias':
            buscarCategorias( termino, res );
            break;
        case 'productos':
            buscarProductos( termino, res );
            break;
        default:
            res.status(500).json({
                msg: 'Se le olvidó hacer esta búsqueda.'
            })
    }
}

module.exports = {
    search
}