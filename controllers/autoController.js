const Auto = require('../models/Auto');
const createError = require('http-errors');
const logger = require('../config/logger');

const handleRequest = (operationName, callback) => async (req, res, next) => {
    try {
        const result = await callback(req);
        logger.info(`${req.method} ${req.originalUrl} - ${operationName} SUCCESS`, { request: req.body, response: result });
        res.json(result);
    } catch (error) {
        logger.error(`${req.method} ${req.originalUrl} - ${operationName} ERROR: ${error.message}`, { request: req.body });
        next(createError(500, error.message));
    }
};

const getAutos = handleRequest('GET_AUTOS', () => Auto.find());

const getAutoById = handleRequest('GET_AUTO_BY_ID', async (req) => {
    const auto = await Auto.findById(req.params.id);
    if (!auto) throw createError(404, 'Auto no encontrado');
    return auto;
});

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

const searchByFilters = async (req, res) => {
    try {
        const { marca, region, tipoCarroceria, precio } = req.query;
        let filter = {};

        if (marca) filter.marca = { $regex: new RegExp(marca, "i") }; // No distingue mayúsculas/minúsculas
        if (region) filter.region = { $regex: new RegExp(region, "i") };
        if (tipoCarroceria) filter.tipoCarroceria = { $regex: new RegExp(tipoCarroceria, "i") };
        if (precio) filter.precio = { $lte: parseInt(precio) };

        const autos = await Auto.find(filter);
        res.json(autos);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar autos", error: error.message });
    }
};


module.exports = { searchByFilters, getAutos, getAutoById, createAuto, updateAuto, deleteAuto };
