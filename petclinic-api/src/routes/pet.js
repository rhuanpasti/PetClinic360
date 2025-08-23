const express = require('express');
const Pet = require('../models/Pet');
const router = express.Router();

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Get all pets
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: List of pets
 */
router.get('/', async (req, res) => {
  const pets = await Pet.findAll();
  res.json(pets);
});

/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Get pet by ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Pet ID
 *     responses:
 *       200:
 *         description: Pet found
 *       404:
 *         description: Pet not found
 */
router.get('/:id', async (req, res) => {
  const pet = await Pet.findByPk(req.params.id);
  if (!pet) return res.status(404).json({ error: 'Pet not found' });
  res.json(pet);
});

/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Create a new pet
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Pet created
 */
router.post('/', async (req, res) => {
  const pet = await Pet.create(req.body);
  res.status(201).json(pet);
});

/**
 * @swagger
 * /pets/{id}:
 *   put:
 *     summary: Update pet by ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Pet ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Pet updated
 *       404:
 *         description: Pet not found
 */
router.put('/:id', async (req, res) => {
  const pet = await Pet.findByPk(req.params.id);
  if (!pet) return res.status(404).json({ error: 'Pet not found' });
  await pet.update(req.body);
  res.json({ message: 'Pet updated' });
});

/**
 * @swagger
 * /pets/{id}:
 *   delete:
 *     summary: Delete pet by ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Pet ID
 *     responses:
 *       200:
 *         description: Pet deleted
 *       404:
 *         description: Pet not found
 */
router.delete('/:id', async (req, res) => {
  const pet = await Pet.findByPk(req.params.id);
  if (!pet) return res.status(404).json({ error: 'Pet not found' });
  await pet.destroy();
  res.json({ message: 'Pet deleted' });
});

module.exports = router;
