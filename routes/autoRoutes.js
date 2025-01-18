const express = require('express');
const router = express.Router();
const autoController = require('../controllers/autoController');
const chalk = require('chalk');
const moment = require('moment');
const mongoose = require('mongoose');

// Función para logs
const logInfo = (color, label, message) => {
    console.log(chalk[color].bold(` [${label}] ${moment().format('YYYY-MM-DD HH:mm:ss')} - ${message} `));
};

// Rutas

// Obtener todos los autos
router.get('/', (req, res, next) => {
    logInfo('blue', 'GET', `GET /api/autos from ${req.ip}`);
    autoController.getAutos(req, res, next);
});

// Buscar autos con filtros
router.get('/buscar', (req, res, next) => {
    const { marca, region, tipoCarroceria, precio } = req.query;
    logInfo(
        'blue',
        'GET',
        `GET /api/autos/buscar?marca=${marca}&region=${region}&tipoCarroceria=${tipoCarroceria}&precio=${precio} from ${req.ip}`
    );
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
router.post('/', async (req, res, next) => {
    logInfo('green', 'POST', `POST /api/autos from ${req.ip}`);
    try {
        const auto = await autoController.createAuto(req.body);
        res.status(201).json(auto);
    } catch (error) {
        logInfo('red', 'POST', `Error creating auto: ${error.message}`);
        next(error);
    }
});

// Actualizar un auto por ID
router.put('/:id', async (req, res, next) => {
    const id = req.params.id;

    // Validar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        logInfo('red', 'PUT', `Invalid ID: ${id} from ${req.ip}`);
        return res.status(400).json({ error: 'ID inválido' });
    }

    logInfo('yellow', 'PUT', `PUT /api/autos/${id} from ${req.ip}`);

    try {
        const auto = await autoController.updateAuto(id, req.body);

        if (!auto) {
            logInfo('yellow', 'PUT', `Auto not found: ${id}`);
            return res.status(404).json({ error: 'Auto no encontrado' });
        }

        res.status(200).json(auto);
    } catch (error) {
        logInfo('red', 'PUT', `Error updating auto: ${error.message}`);
        next(error);
    }
});

// Eliminar un auto por ID
router.delete('/:id', async (req, res, next) => {
    const id = req.params.id;

    // Validar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        logInfo('red', 'DELETE', `Invalid ID: ${id} from ${req.ip}`);
        return res.status(400).json({ error: 'ID inválido' });
    }

    logInfo('red', 'DELETE', `DELETE /api/autos/${id} from ${req.ip}`);

    try {
        const auto = await autoController.deleteAuto(id);

        if (!auto) {
            logInfo('yellow', 'DELETE', `Auto not found: ${id}`);
            return res.status(404).json({ error: 'Auto no encontrado' });
        }

        res.status(200).json({ message: 'Auto eliminado con éxito' });
    } catch (error) {
        logInfo('red', 'DELETE', `Error deleting auto: ${error.message}`);
        next(error);
    }
});

module.exports = router;
