const express = require('express');
const Exam = require('../models/Exam');
const User = require('../models/User');
const Pet = require('../models/Pet');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /exams:
 *   get:
 *     summary: Get all exams for the authenticated user
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of exams
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const exams = await Exam.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Pet, attributes: ['nome', 'especie'] }
      ],
      order: [['data', 'ASC'], ['horario', 'ASC']]
    });
    
    res.json(exams);
  } catch (err) {
    console.error('Error loading exams:', err);
    res.status(500).json({ error: err.message });
  }
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
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const exam = await Exam.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      },
      include: [
        { model: Pet, attributes: ['nome', 'especie'] }
      ]
    });
    
    if (!exam) return res.status(404).json({ error: 'Exam not found' });
    res.json(exam);
  } catch (err) {
    console.error('Error getting exam:', err);
    res.status(500).json({ error: err.message });
  }
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
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { data, horario, tipoExame, petId } = req.body;
    
    // Validate required fields
    if (!data || !horario || !tipoExame || !petId) {
      return res.status(400).json({ 
        error: 'Todos os campos são obrigatórios: data, horario, tipoExame, petId' 
      });
    }

    // Verify if pet belongs to user
    const pet = await Pet.findOne({
      where: { 
        id: petId,
        ownerId: req.user.id 
      }
    });

    if (!pet) {
      return res.status(400).json({ 
        error: 'Pet não encontrado ou não pertence ao usuário' 
      });
    }

    const exam = await Exam.create({
      petId,
      userId: req.user.id,
      tipoExame,
      data,
      horario,
      status: 'agendado'
    });

    // Return the created exam with pet info
    const examWithPet = await Exam.findByPk(exam.id, {
      include: [
        { model: Pet, attributes: ['nome', 'especie'] }
      ]
    });

    res.status(201).json({ 
      message: 'Exame agendado com sucesso',
      exam: examWithPet
    });
  } catch (err) {
    console.error('Error creating exam:', err);
    res.status(500).json({ error: err.message });
  }
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
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { data, horario, tipoExame, petId } = req.body;
    
    // Validate required fields
    if (!data || !horario || !tipoExame || !petId) {
      return res.status(400).json({ 
        error: 'Todos os campos são obrigatórios: data, horario, tipoExame, petId' 
      });
    }

    const exam = await Exam.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });

    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    // Verify if pet belongs to user
    const pet = await Pet.findOne({
      where: { 
        id: petId,
        ownerId: req.user.id 
      }
    });

    if (!pet) {
      return res.status(400).json({ 
        error: 'Pet não encontrado ou não pertence ao usuário' 
      });
    }

    await exam.update({
      data,
      horario,
      tipoExame,
      petId
    });

    res.json({ 
      message: 'Exame atualizado com sucesso',
      exam: await Exam.findByPk(exam.id, {
        include: [
          { model: Pet, attributes: ['nome', 'especie'] }
        ]
      })
    });
  } catch (err) {
    console.error('Error updating exam:', err);
    res.status(500).json({ error: err.message });
  }
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
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const exam = await Exam.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });

    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    await exam.destroy();
    res.json({ message: 'Exame cancelado com sucesso' });
  } catch (err) {
    console.error('Error deleting exam:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /exams/vet/all:
 *   get:
 *     summary: Get all exams for veterinarians
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all exams
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only veterinarians can access
 */
router.get('/vet/all', authenticateToken, async (req, res) => {
  try {
    // Check if user is a veterinarian
    if (req.user.role !== 'vet') {
      return res.status(403).json({ error: 'Acesso negado. Apenas veterinários podem ver todos os exames.' });
    }

    const exams = await Exam.findAll({
      include: [
        { model: User, attributes: ['nome', 'email'] },
        { model: Pet, attributes: ['nome', 'especie'] }
      ],
      order: [['data', 'ASC'], ['horario', 'ASC']]
    });
    
    res.json(exams);
  } catch (err) {
    console.error('Error loading vet exams:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
