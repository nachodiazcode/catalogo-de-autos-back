require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swaggerDocs");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const chalk = require("chalk");

// 🚀 Inicializar la aplicación Express
const app = express();

// 🌍 Configurar variables de entorno con valores por defecto
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "0.0.0.0"; // Escuchar todas las interfaces
const NODE_ENV = process.env.NODE_ENV || "production";

// 🔹 Verificar configuración inicial
if (!process.env.MONGO_URI) {
  console.error(chalk.red("❌ MONGO_URI no está definido en las variables de entorno."));
  process.exit(1);
}

// 🔹 Conectar a MongoDB con reintento automático
(async () => {
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      await connectDB();
      console.log(chalk.green("✅ Conectado a MongoDB 🚀"));
      break;
    } catch (error) {
      attempts++;
      console.error(
        chalk.red(`❌ Error conectando a MongoDB (Intento ${attempts}/${maxAttempts}):`),
        error.message
      );

      if (attempts >= maxAttempts) {
        console.error(
          chalk.red("💥 No se pudo conectar a MongoDB después de varios intentos. Cerrando la aplicación.")
        );
        process.exit(1);
      }

      console.log(chalk.yellow("🔄 Reintentando conexión en 5 segundos..."));
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
})();

// 🔹 Configurar CORS
const corsOptions = {
  origin: ["http://146.190.52.199", "http://146.190.52.199:3000"], // Dominios permitidos
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// 🔹 Middlewares de seguridad y optimización
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(morgan(NODE_ENV === "development" ? "dev" : "combined"));
app.use(compression());

// 🔍 Middleware de depuración de solicitudes (opcional)
app.use((req, res, next) => {
  console.log(`🔍 Nueva solicitud: ${req.method} ${req.originalUrl}`);
  next();
});

// 💾 Middleware para procesar datos JSON y codificados en URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🌟 Servir la carpeta "images" como estática
app.use(
  "/images",
  express.static(path.join(__dirname, "images"))
);
console.log(chalk.blue(`🖼️ Imágenes disponibles en: http://${HOST}:${PORT}/images/<nombre-del-archivo>`));

// 📄 Documentación Swagger
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log(chalk.cyan(`📄 Swagger disponible en: http://${HOST}:${PORT}/api/docs`));

// 🚗 Definir Rutas API
app.use("/api/autos", require("./routes/autoRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// 🔹 Ruta para la página de inicio de la API
app.get("/api/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>API Automotora Massat</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          h1 { color: #2E86C1; }
          p { color: #555; }
          a { color: #1E8449; text-decoration: none; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>🚗 Bienvenido a la API de Automotora Massat 🚀</h1>
        <p>Para acceder a la documentación de la API, visita:</p>
        <p><a href="/api/docs">📄 Documentación Swagger</a></p>
        <p>Para obtener la lista de autos disponibles, usa:</p>
        <p><a href="/api/autos">🔍 Ver Autos</a></p>
      </body>
    </html>
  `);
});

// 🔥 Prueba de vida para el servidor
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "El servidor está funcionando correctamente 🚀" });
});

// ❌ Middleware para manejar errores globales
app.use(errorHandler);

// 🚀 Manejo de excepciones no controladas
process.on("uncaughtException", (error) => {
  console.error(chalk.red("❌ Excepción no controlada:"), error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(chalk.red("❌ Rechazo de promesa no manejado:"), reason);
  process.exit(1);
});

// 🔥 Iniciar Servidor
const server = app.listen(PORT, HOST, () => {
  console.log(chalk.green(`🚀 Servidor corriendo en http://${HOST}:${PORT}/api/ 🚗`));
});

// 🛑 Manejo del cierre de la aplicación
process.on("SIGTERM", async () => {
  console.log(chalk.yellow("🛑 Recibido SIGTERM. Cerrando la aplicación..."));
  server.close(() => {
    console.log(chalk.green("✅ Servidor cerrado correctamente."));
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log(chalk.yellow("🛑 Recibido SIGINT. Cerrando la aplicación..."));
  server.close(() => {
    console.log(chalk.green("✅ Servidor cerrado correctamente."));
    process.exit(0);
  });
});
