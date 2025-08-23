const express = require('express');
const Exam = require('../models/Exam');
const router = express.Router();

/**
 * @swagger
 * /exams:
 *   get:
 *     summary: Get all exams
 *     tags: [Exams]
 *     responses:
 *       200:
 *         description: List of exams
 */
router.get('/', async (req, res) => {
  const exams = await Exam.findAll();
  res.json(exams);
});

/**
 * @swagger
 * /exams/{id}:
 *   get:
 *     summary: Get exam by ID
 *     tags: [Exams]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Exam ID
 *     responses:
 *       200:
 *         description: Exam found
 *       404:
 *         description: Exam not found
 */
router.get('/:id', async (req, res) => {
  const exam = await Exam.findByPk(req.params.id);
  if (!exam) return res.status(404).json({ error: 'Exam not found' });
  res.json(exam);
});

/**
 * @swagger
 * /exams:
 *   post:
 *     summary: Create a new exam
 *     tags: [Exams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Exam created
 */
router.post('/', async (req, res) => {
  const exam = await Exam.create(req.body);
  res.status(201).json(exam);
});

/**
 * @swagger
 * /exams/{id}:
 *   put:
 *     summary: Update exam by ID
 *     tags: [Exams]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Exam ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Exam updated
 *       404:
 *         description: Exam not found
 */
router.put('/:id', async (req, res) => {
  const exam = await Exam.findByPk(req.params.id);
  if (!exam) return res.status(404).json({ error: 'Exam not found' });
  await exam.update(req.body);
  res.json({ message: 'Exam updated' });
});

/**
 * @swagger
 * /exams/{id}:
 *   delete:
 *     summary: Delete exam by ID
 *     tags: [Exams]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Exam ID
 *     responses:
 *       200:
 *         description: Exam deleted
 *       404:
 *         description: Exam not found
 */
router.delete('/:id', async (req, res) => {
  const exam = await Exam.findByPk(req.params.id);
  if (!exam) return res.status(404).json({ error: 'Exam not found' });
  await exam.destroy();
  res.json({ message: 'Exam deleted' });
});

module.exports = router;
