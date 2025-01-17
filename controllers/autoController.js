const Auto = require('../models/Auto');
const createError = require('http-errors');
const logger = require('../config/logger');

// Wrapper genérico para manejar solicitudes con logging y manejo de errores
const handleRequest = (operationName, callback) => async (req, res, next) => {
    try {
        const result = await callback(req);
        logger.info(`${req.method} ${req.originalUrl} - ${operationName} SUCCESS`, {
            request: req.body,
            response: result,
        });
        res.json(result);
    } catch (error) {
        logger.error(`${req.method} ${req.originalUrl} - ${operationName} ERROR: ${error.message}`, {
            request: req.body,
        });
        next(createError(500, error.message));
    }
};

// Controladores básicos con wrapper
const getAutos = handleRequest('GET_AUTOS', () => Auto.find());

const getAutoById = async (req, res, next) => {
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
        console.error('Error al obtener auto:', error);
        next(error);
    }
};

const createAuto = handleRequest('CREATE_AUTO', async (req) => {
    const nuevoAuto = new Auto(req.body);
    return await nuevoAuto.save();
});

const updateAuto = handleRequest('UPDATE_AUTO', async (req) => {
    const autoActualizado = await Auto.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!autoActualizado) throw createError(404, 'Auto no encontrado');
    return autoActualizado;
});

const deleteAuto = handleRequest('DELETE_AUTO', async (req) => {
    const autoEliminado = await Auto.findByIdAndDelete(req.params.id);
    if (!autoEliminado) throw createError(404, 'Auto no encontrado');
    return { message: 'Auto eliminado correctamente' };
});

// Búsqueda con filtros y logging
const searchByFilters = async (req, res, next) => {
    try {
        const { marca, region, tipoCarroceria, precio } = req.query;
        const filter = {};

        // Construcción dinámica de filtros
        if (marca) filter.marca = { $regex: new RegExp(marca, "i") };
        if (region) filter.region = { $regex: new RegExp(region, "i") };
        if (tipoCarroceria) filter.tipoCarroceria = { $regex: new RegExp(tipoCarroceria, "i") };
        if (precio) filter.precio = { $lte: parseInt(precio) };

        logger.info(`GET /api/autos/buscar - SEARCH_BY_FILTERS`, { filters: filter });

        const autos = await Auto.find(filter);

        if (autos.length === 0) {
            logger.warn('SEARCH_BY_FILTERS - No se encontraron autos para los filtros proporcionados', { filters: filter });
        }

        res.json(autos);
    } catch (error) {
        logger.error('SEARCH_BY_FILTERS ERROR:', { error: error.message });
        next(createError(500, 'Error al buscar autos'));
    }
};

// Exportar controladores
module.exports = {
    getAutos,
    getAutoById,
    createAuto,
    updateAuto,
    deleteAuto,
    searchByFilters,
};
