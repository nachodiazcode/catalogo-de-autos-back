const express = require('express');
const router = express.Router();
const autoController = require('../controllers/autoController');
const chalk = require('chalk');
const moment = require('moment');
const mongoose = require('mongoose');

// Función para logs
const logInfo = (color, label, message) =>
    console.log(chalk[color].bold(` [${label}] ${moment().format('YYYY-MM-DD HH:mm:ss')} - ${message} `));

// Rutas

// Obtener todos los autos
router.get('/', (req, res, next) => {
    logInfo('blue', 'GET', `GET /api/autos from ${req.ip}`);
    autoController.getAutos(req, res, next);
});

// Buscar autos con filtros
router.get('/buscar', (req, res, next) => {
    logInfo('blue', 'GET', `GET /api/autos/buscar?marca=${req.query.marca}&region=${req.query.region}&tipoCarroceria=${req.query.tipoCarroceria}&precio=${req.query.precio} from ${req.ip}`);
    autoController.searchByFilters(req, res, next);
});

// Obtener detalle de un auto por ID
router.get('/:id', async (req, res, next) => {
    const id = req.params.id;

    // Validar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        logInfo('red', 'GET', `Invalid ID: ${id} from ${req.ip}`);
        return res.status(400).json({ error: 'ID inválido' });
    }

    logInfo('blue', 'GET', `GET /api/autos/${id} from ${req.ip}`);

    try {
        const auto = await autoController.getAutoById(id);

        if (!auto) {
            logInfo('yellow', 'GET', `Auto not found: ${id}`);
            return res.status(404).json({ error: 'Auto no encontrado' });
        }

        res.status(200).json(auto);
    } catch (error) {
        logInfo('red', 'GET', `Error fetching auto by ID: ${error.message}`);
        next(error);
    }
});

// Crear un nuevo auto
router.post('/', (req, res, next) => {
    logInfo('green', 'POST', `POST /api/autos from ${req.ip}`);
    autoController.createAuto(req, res, next);
});

// Actualizar un auto por ID
router.put('/:id', (req, res, next) => {
    logInfo('yellow', 'PUT', `PUT /api/autos/${req.params.id} from ${req.ip}`);
    autoController.updateAuto(req, res, next);
});

// Eliminar un auto por ID
router.delete('/:id', (req, res, next) => {
    logInfo('red', 'DELETE', `DELETE /api/autos/${req.params.id} from ${req.ip}`);
    autoController.deleteAuto(req, res, next);
});

module.exports = router;
