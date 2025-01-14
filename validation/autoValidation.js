const Joi = require('@hapi/joi');

const autoSchema = Joi.object({
    marca: Joi.string().required(),
    region: Joi.string().required(),
    tipoCarroceria: Joi.string().required(),
    precio: Joi.number().required()
});

module.exports = autoSchema;
