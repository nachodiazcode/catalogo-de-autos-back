const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log('✅ Conectado a MongoDB');
    } catch (error) {
        console.error('❌ Error en conexión MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
