require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swaggerDocs");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");

// 🚀 Inicializar la aplicación Express
const app = express();

// 🌍 Configurar variables de entorno con valores por defecto
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";
const NODE_ENV = process.env.NODE_ENV || "production";

// 🔹 Conectar a MongoDB con reintento automático
(async () => {
  let attempts = 0;
  const maxAttempts = 3; // Máximo de intentos para conectar a MongoDB

  while (attempts < maxAttempts) {
    try {
      await connectDB();
      console.log("✅ Conectado a MongoDB 🚀");
      break;
    } catch (error) {
      attempts++;
      console.error(`❌ Error conectando a MongoDB (Intento ${attempts}/${maxAttempts}):`, error.message);

      if (attempts >= maxAttempts) {
        console.error("💥 No se pudo conectar a MongoDB después de varios intentos. Cerrando la aplicación.");
        process.exit(1);
      }

      console.log("🔄 Reintentando conexión en 5 segundos...");
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Espera 5 segundos antes de reintentar
    }
  }
})();

// 🔹 Middlewares de seguridad y optimización
app.use(helmet());
app.use(
  cors({
    origin: ["https://automotoramassat.online"], // Solo permitir tu dominio
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan(NODE_ENV === "development" ? "dev" : "combined"));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Permitir datos en formato URL

// Middleware
app.use(express.json());

// 📄 Documentación Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log(`📄 Swagger disponible en: https://automotoramassat.online/api-docs`);

// 🚗 Definir Rutas API
app.use("/api/autos", require("./routes/autoRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// ❌ Middleware para manejar errores globales
app.use(errorHandler);

// 🚀 Manejo de excepciones no controladas
process.on("uncaughtException", (error) => {
  console.error("❌ Excepción no controlada:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Rechazo de promesa no manejado:", reason);
  process.exit(1);
});

// 🔥 Iniciar Servidor
const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor corriendo en https://automotoramassat.online 🚗`);
});

// 🛑 Manejo del cierre de la aplicación
process.on("SIGTERM", async () => {
  console.log("🛑 Recibido SIGTERM. Cerrando la aplicación...");
  server.close(() => {
    console.log("✅ Servidor cerrado correctamente.");
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("🛑 Recibido SIGINT. Cerrando la aplicación...");
  server.close(() => {
    console.log("✅ Servidor cerrado correctamente.");
    process.exit(0);
  });
});
