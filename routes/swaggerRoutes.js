/**
 * @swagger
 * tags:
 *   name: Autos
 *   description: API para gestionar autos
 */

/**
 * @swagger
 * /api/autos:
 *   get:
 *     summary: Obtiene todos los autos
 *     tags: [Autos]
 *     responses:
 *       200:
 *         description: Lista de autos obtenida correctamente
 */

/**
 * @swagger
 * /api/autos/buscar:
 *   get:
 *     summary: Busca autos con filtros
 *     tags: [Autos]
 *     parameters:
 *       - in: query
 *         name: marca
 *         schema:
 *           type: string
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *       - in: query
 *         name: tipoCarroceria
 *         schema:
 *           type: string
 *       - in: query
 *         name: precio
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Lista de autos filtrada correctamente
 */

/**
 * @swagger
 * /api/autos/{id}:
 *   get:
 *     summary: Obtiene un auto por ID
 *     tags: [Autos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Auto encontrado correctamente
 */

/**
 * @swagger
 * /api/autos:
 *   post:
 *     summary: Crea un nuevo auto
 *     tags: [Autos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               marca:
 *                 type: string
 *               region:
 *                 type: string
 *               tipoCarroceria:
 *                 type: string
 *               precio:
 *                 type: number
 *     responses:
 *       201:
 *         description: Auto creado correctamente
 */

/**
 * @swagger
 * /api/autos/{id}:
 *   put:
 *     summary: Actualiza un auto por ID
 *     tags: [Autos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Auto actualizado correctamente
 */

/**
 * @swagger
 * /api/autos/{id}:
 *   delete:
 *     summary: Elimina un auto por ID
 *     tags: [Autos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Auto eliminado correctamente
 */
