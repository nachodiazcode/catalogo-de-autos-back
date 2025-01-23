const mongoose = require('mongoose');
const logger = require('./logger'); // Ajusta la ruta si usas un logger

const connectDB = async () => {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
        throw new Error('❌ No se proporcionó una URI para MongoDB en las variables de entorno');
    }

    try {
        // Conexión a MongoDB sin opciones obsoletas
        await mongoose.connect(MONGO_URI);
        logger.info('✅ Conectado a MongoDB 🚀');
    } catch (error) {
        logger.error(`❌ Error en conexión a MongoDB: ${error.message}`);
        process.exit(1); // Finaliza el proceso si la conexión falla
    }
};

module.exports = connectDB;
