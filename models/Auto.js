const mongoose = require('mongoose');

const AutoSchema = new mongoose.Schema({
    marca: { type: String, required: true },
    region: { type: String, required: true },
    tipoCarroceria: { type: String, required: true },
    precio: { type: Number, required: true },
    imagen: { type: String, default: null } // URL de la imagen
}, { timestamps: true });

module.exports = mongoose.model('Auto', AutoSchema);
