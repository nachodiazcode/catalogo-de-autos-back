const mongoose = require('mongoose');

const AutoSchema = new mongoose.Schema({
    marca: { type: String, },
    region: { type: String, },
    tipoCarroceria: { type: String, },
    precio: { type: Number, },
    imagen: { type: String, default: null },
});


module.exports = mongoose.model('Auto', AutoSchema);
