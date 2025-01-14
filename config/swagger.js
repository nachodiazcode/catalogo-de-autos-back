const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Catálogo de Autos",
            version: "1.0.0",
            description: "Documentación de la API para gestionar un catálogo de autos",
        },
        servers: [{ url: "http://localhost:3000" }],
    },
    apis: ["./routes/*.js"], // Indica dónde están las rutas a documentar
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
