const { Categoria, Usuario, Producto } = require('../models');
const Role = require('../models/role');

const isRoleValid = async(role = '') => {
    const existsRole = await Role.findOne({ role });

    if( !existsRole ) {
        throw new Error(`El rol ${ role } no está registrado en la BD.`)
    }
}

const isEmailExists = async( email = '' ) => {
    /* Verificando si el email existe */
    const existEmail = await Usuario.findOne({ email });

    if( existEmail ) {
        throw new Error(`El email ${ email } ya existe en otra cuenta.`)
    }
}

const existsUserById = async( id ) => {
    /* Verificar si el correo existe */
    const existsUser = await Usuario.findById(id);

    if( !existsUser ) {
        throw new Error(`El id ${ id } no existe.`)
    }
}

const existsCategoriaById = async( id ) => {
    /* Verificar si la categoria existe */
    const existsCategoria = await Categoria.findById( id );

    if( !existsCategoria ) {
        throw new Error(`La categoria con el id: ${ id } no existe.`)
    }
}

const existsCategoriaByNombre = async ( req, res, next ) => {
    const { name } = req.body;
    const { id } = req.params;
    const nameActualizado = name.toUpperCase();
  
    try {
        const categoriaActual = await Categoria.findById(id);
    
        if (categoriaActual.name !== nameActualizado) {
            const existsCategoria = await Categoria.findOne({ name: nameActualizado });
    
            if (existsCategoria) {
            throw new Error(`La categoría ${ nameActualizado.toUpperCase() } ya existe.`);
            }
        }
    
        next();
    } catch (error) {
        res.status(400).json({
            error: `La categoria ${ name.toUpperCase() } ya existe.`
        })
    }
};

const existsProductoById = async(id) => {
    /* Verificar si el producto existe */
    const existsProducto = await Producto.findById( id );

    if( !existsProducto ) {
        throw new Error(`El producto con el id: ${ id } no existe.`)
    }
}

const existsProductoByNombre = async ( req, res, next ) => {
    const { name } = req.body;
    const { id } = req.params;
    const nameActualizado = name.toUpperCase();
  
    try {
        const productoActual = await Producto.findById(id);
  
        if (productoActual.name !== nameActualizado) {
            const existsProducto = await Producto.findOne({ name: nameActualizado });
  
            if (existsProducto) {
            throw new Error(`El producto ${ nameActualizado.toUpperCase() } ya existe.`);
            }
        }
  
        next();
    } catch (error) {
        res.status(400).json({
            error: `El producto ${ name.toUpperCase() } ya existe.`
        })
    }
};

const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) => {
    const incluida = colecciones.includes(coleccion);

    if( !incluida ) {
        throw new Error(`La coleccion ${ coleccion } no es permitida. Colecciones permitidas: ${ colecciones }`);
    }    

    return true;
}

module.exports = {
    coleccionesPermitidas,
    existsCategoriaById,
    existsCategoriaByNombre,
    existsProductoById,
    existsProductoByNombre,
    existsUserById,
    isEmailExists,
    isRoleValid
}