const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({ 
    name: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio.'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precie: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    description: {
        type: String
    },
    available: {
        type: Boolean,
        default: true
    },
    img: {
        type: String
    }
});

ProductoSchema.methods.toJSON = function() {
    const { __v, _id, status, ...producto } = this.toObject();
    producto.uid = _id;

    return producto;
}

module.exports = model( 'Producto', ProductoSchema );