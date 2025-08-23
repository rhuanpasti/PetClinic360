const express = require('express');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments for a user
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log(req.user);
    console.log(await Appointment.findAll());
    const appointments = await Appointment.findAll({
      where: { userId: req.user.id },
      order: [['data', 'ASC'], ['horario', 'ASC']]
    });
    
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - data
 *               - horario
 *               - sintomas
 *             properties:
 *               data:
 *                 type: string
 *                 format: date
 *               horario:
 *                 type: string
 *               sintomas:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { data, horario, sintomas } = req.body;
    
    if (!data || !horario || !sintomas) {
      return res.status(400).json({ error: 'Data, horário e sintomas são obrigatórios' });
    }

    // Check if the time slot is available
    const existingAppointment = await Appointment.findOne({
      where: { 
        data: data,
        horario: horario,
        status: ['agendado', 'confirmado']
      }
    });

    if (existingAppointment) {
      return res.status(400).json({ error: 'Este horário já está ocupado' });
    }

    const appointment = await Appointment.create({
      userId: req.user.id,
      data,
      horario,
      sintomas,
      status: 'agendado'
    });

    res.status(201).json({
      message: 'Consulta agendada com sucesso',
      appointment
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Update an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 format: date
 *               horario:
 *                 type: string
 *               sintomas:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment updated
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Appointment not found
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { data, horario, sintomas } = req.body;
    
    const appointment = await Appointment.findOne({
      where: { id, userId: req.user.id }
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Consulta não encontrada' });
    }

    // Check if the new time slot is available (excluding current appointment)
    if (data && horario) {
      const existingAppointment = await Appointment.findOne({
        where: { 
          data: data,
          horario: horario,
          status: ['agendado', 'confirmado'],
          id: { [require('sequelize').Op.ne]: id }
        }
      });

      if (existingAppointment) {
        return res.status(400).json({ error: 'Este horário já está ocupado' });
      }
    }

    await appointment.update({
      data: data || appointment.data,
      horario: horario || appointment.horario,
      sintomas: sintomas || appointment.sintomas
    });

    res.json({
      message: 'Consulta atualizada com sucesso',
      appointment
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Delete an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Appointment deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Appointment not found
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findOne({
      where: { id, userId: req.user.id }
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Consulta não encontrada' });
    }

    await appointment.destroy();

    res.json({ message: 'Consulta cancelada com sucesso' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /appointments/vet/all:
 *   get:
 *     summary: Get all appointments for veterinarians
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all appointments
 *       401:
 *         description: Unauthorized
 */
router.get('/vet/all', authenticateToken, async (req, res) => {
  try {
    // Check if user is a veterinarian
    if (req.user.role !== 'vet') {
      return res.status(403).json({ error: 'Acesso negado. Apenas veterinários podem ver todas as consultas.' });
    }

    const appointments = await Appointment.findAll({
      include: [{ model: User, attributes: ['nome', 'email'] }],
      order: [['data', 'ASC'], ['horario', 'ASC']]
    });
    
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /appointments/{id}/laudo:
 *   put:
 *     summary: Add medical report to appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - laudo
 *             properties:
 *               laudo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Medical report added
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Appointment not found
 */
router.put('/:id/laudo', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { laudo } = req.body;
    
    // Check if user is a veterinarian
    if (req.user.role !== 'vet') {
      return res.status(403).json({ error: 'Acesso negado. Apenas veterinários podem adicionar laudos.' });
    }

    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ error: 'Consulta não encontrada' });
    }

    await appointment.update({ laudo });

    res.json({
      message: 'Laudo adicionado com sucesso',
      appointment
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
