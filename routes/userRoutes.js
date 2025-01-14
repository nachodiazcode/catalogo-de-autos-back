const express = require('express');
const router = express.Router();
const autoController = require('../controllers/autoController');

router.get('/', autoController.getAutos);
router.post('/', autoController.createAuto);

module.exports = router; // 👈 Asegura que se exporta correctamente
