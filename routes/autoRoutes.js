const express = require('express');
const router = express.Router();
const autoController = require('../controllers/autoController');
const chalk = require('chalk');
const moment = require('moment');
const mongoose = require('mongoose');
const Auto = require('../models/Auto');

// Función para logs
const logInfo = (color, label, message) => {
    console.log(chalk[color].bold(` [${label}] ${moment().format('YYYY-MM-DD HH:mm:ss')} - ${message} `));
};

// Middleware para procesar `req.body`
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

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
router.get('/detalle/:id', async (req, res) => {
    const id = req.params.id;

    // Validar formato del ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        const auto = await Auto.findById(id);
        if (!auto) {
            return res.status(404).json({ error: 'Auto no encontrado' });
        }

        res.status(200).json(auto);
    } catch (error) {
        console.error('Error al obtener auto por ID:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Crear un nuevo auto
router.post('/', async (req, res, next) => {
    logInfo('green', 'POST', `POST /api/autos from ${req.ip}`);
    try {
        // Validar que el cuerpo no esté vacío
        if (!req.body || Object.keys(req.body).length === 0) {
            logInfo('red', 'POST', 'El cuerpo de la solicitud está vacío');
            return res.status(400).json({ error: 'El cuerpo de la solicitud está vacío' });
        }

        const { marca, region, tipoCarroceria, precio, imagen } = req.body;

        // Validar campos requeridos
        if (!marca || !region || !tipoCarroceria || !precio) {
            logInfo(
                'red',
                'POST',
                'Faltan campos requeridos: marca, region, tipoCarroceria, precio son obligatorios'
            );
            return res.status(400).json({
                error: 'Los campos marca, region, tipoCarroceria y precio son obligatorios',
            });
        }

        // Crear el nuevo auto
        const nuevoAuto = new Auto({
            marca,
            region,
            tipoCarroceria,
            precio,
            imagen: imagen || null, // Campo opcional con valor predeterminado
        });

        const autoCreado = await nuevoAuto.save();
        logInfo('green', 'POST', `Auto creado con éxito: ${JSON.stringify(autoCreado)}`);
        res.status(201).json(autoCreado);
    } catch (error) {
        logInfo('red', 'POST', `Error al crear el auto: ${error.message}`);
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
        const auto = await Auto.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

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
        const auto = await Auto.findByIdAndDelete(id);

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
