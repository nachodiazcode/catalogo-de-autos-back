require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const connectDB = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swaggerDocs");
const errorHandler = require("./middlewares/errorHandler");

// 🚀 Inicializar la aplicación Express
const app = express();

// 🔹 Conectar a la Base de Datos MongoDB Atlas
(async () => {
  try {
    await connectDB();
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
    process.exit(1); // Cerrar la aplicación si hay un error crítico
  }
})();

// 🔹 Middlewares de seguridad y optimización
app.use(helmet());
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(morgan("dev"));
app.use(compression());
app.use(express.json());

// 📄 Documentación Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log(`📄 Swagger disponible en:https://automotoramassat.online:${process.env.PORT || 5000}/api-docs`);

// 🚗 Rutas API
app.use("/api/autos", require("./routes/autoRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// ❌ Middleware para manejar errores globales
app.use(errorHandler);

// 🌍 Definir Puerto
const PORT = process.env.PORT || 5000;

// 🔥 Iniciar Servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en https://automotoramassat.online:${PORT}`);
});
