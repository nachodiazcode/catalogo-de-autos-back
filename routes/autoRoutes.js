
const express = require('express');
const router = express.Router();
const autoController = require('../controllers/autoController');
const chalk = require('chalk');
const moment = require('moment');

const logInfo = (color, label, message) => console.log(chalk[color].bold(` [${label}] ${moment().format('YYYY-MM-DD HH:mm:ss')} - ${message} `));

router.get('/', (req, res, next) => {
    logInfo('blue', 'GET', `GET /api/autos from ${req.ip}`);
    autoController.getAutos(req, res, next);
});

router.get('/buscar', (req, res, next) => {
    logInfo('blue', 'GET', `GET /api/autos/buscar?marca=${req.query.marca}&region=${req.query.region}&tipoCarroceria=${req.query.tipoCarroceria}&precio=${req.query.precio} from ${req.ip}`);
    autoController.searchByFilters(req, res, next);
});

router.get('/:id', (req, res, next) => {
    logInfo('blue', 'GET', `GET /api/autos/detalle/${req.params.id} from ${req.ip}`);
    autoController.getAutoById(req, res, next);
});

router.post('/', (req, res, next) => {
    logInfo('green', 'POST', `POST /api/autos from ${req.ip}`);
    autoController.createAuto(req, res, next);
});

router.put('/:id', (req, res, next) => {
    logInfo('yellow', 'PUT', `PUT /api/autos/${req.params.id} from ${req.ip}`);
    autoController.updateAuto(req, res, next);
});

router.delete('/:id', (req, res, next) => {
    logInfo('red', 'DELETE', `DELETE /api/autos/${req.params.id} from ${req.ip}`);
    autoController.deleteAuto(req, res, next);
});

module.exports = router;
