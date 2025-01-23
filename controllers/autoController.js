const mongoose = require('mongoose');
const Auto = require('../models/Auto');
const createError = require('http-errors');
const logger = require('../config/logger');
const chalk = require('chalk');

// Emojis para los mensajes
const successIcon = '✅';
const errorIcon = '❌';
const infoIcon = 'ℹ️';
const warningIcon = '⚠️';

// Wrapper genérico para manejar solicitudes con logging y manejo de errores
const handleRequest = (operationName, callback) => async (req, res, next) => {
    console.log(chalk.blue(`${infoIcon} ${operationName} iniciado - ${req.method} ${req.originalUrl}`));
    try {
        const result = await callback(req);
        console.log(
            chalk.green(
                `${successIcon} ${operationName} COMPLETADO - ${req.method} ${req.originalUrl}`
            )
        );
        res.json(result);
    } catch (error) {
        console.error(
            chalk.red(
                `${errorIcon} ${operationName} ERROR - ${req.method} ${req.originalUrl}: ${error.message}`
            )
        );
        next(error); // Se propaga el error al middleware global de manejo de errores
    }
};

// Controladores básicos con wrapper
const getAutos = handleRequest('GET_AUTOS', async () => {
    console.log(chalk.blue(`${infoIcon} Obteniendo todos los autos de la base de datos...`));
    const autos = await Auto.find();
    console.log(chalk.green(`${successIcon} Total de autos encontrados: ${autos.length}`));
    return autos;
});

const getAutoById = handleRequest('GET_AUTO_BY_ID', async (req) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log(chalk.yellow(`${warningIcon} ID inválido proporcionado: ${id}`));
        throw createError(400, 'ID inválido');
    }

    console.log(chalk.blue(`${infoIcon} Buscando auto con ID: ${id}`));
    const auto = await Auto.findById(id);
    if (!auto) {
        console.log(chalk.yellow(`${warningIcon} No se encontró un auto con ID: ${id}`));
        throw createError(404, 'Auto no encontrado');
    }
    console.log(chalk.green(`${successIcon} Auto encontrado: ${JSON.stringify(auto)}`));
    return auto;
});

const createAuto = handleRequest('CREATE_AUTO', async (req) => {
    console.log(chalk.blue(`${infoIcon} Procesando creación de auto...`));
    console.log('🔍 Contenido de req.body:', req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
        throw createError(400, 'El cuerpo de la solicitud está vacío');
    }

    const { precio, tipoCarroceria, region, marca } = req.body;

    if (!precio || !tipoCarroceria || !region || !marca) {
        console.log(chalk.yellow(`${warningIcon} Campos requeridos faltantes en req.body`));
        throw createError(400, 'Todos los campos (precio, tipoCarroceria, region, marca) son obligatorios');
    }

    const nuevoAuto = new Auto(req.body);
    const autoCreado = await nuevoAuto.save();
    console.log(chalk.green(`${successIcon} Auto creado exitosamente: ${JSON.stringify(autoCreado)}`));
    return autoCreado;
});

const updateAuto = handleRequest('UPDATE_AUTO', async (req) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log(chalk.yellow(`${warningIcon} ID inválido proporcionado para actualización: ${id}`));
        throw createError(400, 'ID inválido');
    }

    console.log(chalk.blue(`${infoIcon} Actualizando auto con ID: ${id}...`));
    const autoActualizado = await Auto.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!autoActualizado) {
        console.log(chalk.yellow(`${warningIcon} No se encontró un auto con ID: ${id} para actualizar`));
        throw createError(404, 'Auto no encontrado');
    }
    console.log(chalk.green(`${successIcon} Auto actualizado exitosamente: ${JSON.stringify(autoActualizado)}`));
    return autoActualizado;
});

const deleteAuto = handleRequest('DELETE_AUTO', async (req) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log(chalk.yellow(`${warningIcon} ID inválido proporcionado para eliminación: ${id}`));
        throw createError(400, 'ID inválido');
    }

    console.log(chalk.blue(`${infoIcon} Eliminando auto con ID: ${id}...`));
    const autoEliminado = await Auto.findByIdAndDelete(id);
    if (!autoEliminado) {
        console.log(chalk.yellow(`${warningIcon} No se encontró un auto con ID: ${id} para eliminar`));
        throw createError(404, 'Auto no encontrado');
    }
    console.log(chalk.green(`${successIcon} Auto eliminado exitosamente: ${JSON.stringify(autoEliminado)}`));
    return { message: 'Auto eliminado correctamente' };
});

const fuzzysort = require("fuzzysort");

const searchByFilters = async (req, res, next) => {
  try {
    const { marca, region, tipoCarroceria, precio } = req.query;

    const autos = await Auto.find().lean(); // Obtenemos todos los datos de la DB

    // Filtrar con fuzzysort para soportar errores tipográficos
    let filteredAutos = autos;

    if (marca) {
      filteredAutos = fuzzysort
        .go(marca, filteredAutos, { key: "marca" })
        .map((result) => result.obj);
    }
    if (region) {
      filteredAutos = fuzzysort
        .go(region, filteredAutos, { key: "region" })
        .map((result) => result.obj);
    }
    if (tipoCarroceria) {
      filteredAutos = fuzzysort
        .go(tipoCarroceria, filteredAutos, { key: "tipoCarroceria" })
        .map((result) => result.obj);
    }
    if (precio) {
      filteredAutos = filteredAutos.filter(
        (auto) => auto.precio <= parseInt(precio, 10)
      );
    }

    res.json(filteredAutos);
  } catch (error) {
    console.error("Error en búsqueda:", error.message);
    next(error);
  }
};


module.exports = {
    getAutos,
    getAutoById,
    createAuto,
    updateAuto,
    deleteAuto,
    searchByFilters,
};
