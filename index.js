require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const connectDB = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swaggerDocs");

// 🚀 Inicializar la aplicación Express
const app = express();

// 🔹 Conectar a la Base de Datos MongoDB Atlas
connectDB();

// 🔹 Middlewares de seguridad y optimización
app.use(helmet());
app.use(cors({ origin: "*", methods: "GET,POST,PUT,DELETE" }));
app.use(morgan("dev"));
app.use(compression());
app.use(express.json());

// 📄 Documentación Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log(`📄 Swagger disponible en: http://${process.env.HOST || "localhost"}:${process.env.PORT || 5000}/api-docs`);

// 🚗 Rutas API
app.use("/api/autos", require("./routes/autoRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// ❌ Middleware para manejar errores globales
app.use(require("./middlewares/errorHandler"));

// 🌍 Definir Puerto y Host
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0"; // Permite accesos desde cualquier IP

// 🔥 Iniciar Servidor
app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor corriendo en http://${process.env.HOST || "138.197.135.225"}:${PORT}`);
});
