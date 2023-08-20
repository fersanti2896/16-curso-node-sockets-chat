const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la categoría es obligatorio.'],
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
    }
});

CategoriaSchema.methods.toJSON = function() {
    const { __v, _id, status, ...categoria } = this.toObject();
    categoria.uid = _id;

    return categoria;
}

module.exports = model( 'Categoria', CategoriaSchema );