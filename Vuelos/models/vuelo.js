const mongoose = require('mongoose')
const vuelosSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    origen: {
        type: String,
        required: true
    },
    destino: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    numEscalas: {
        type: Number,
        required: false
    },
    listaEscalas: {
        type: [String],
        required: false
    },
    aerolinea: {
        type: String,
        required: true
    }
})
module.exports = mongoose.model('Vuelo', vuelosSchema)