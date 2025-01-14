require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerDocs');

const app = express();

// Conectar BD
connectDB();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());

const cors = require("cors");
app.use(cors({ origin: "*" })); // Permitir todas las conexiones

app.use(
    cors({
      origin: "*",
      methods: "GET,POST,PUT,DELETE",
    })
  );

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

console.log(`📄 Swagger disponible en: http://localhost:${process.env.PORT || 5000}/api-docs`);

// Rutas
app.use('/api/autos', require('./routes/autoRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Middleware de errores
app.use(require('./middlewares/errorHandler'));

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
