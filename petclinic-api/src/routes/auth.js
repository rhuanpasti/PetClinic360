const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

/**
 * @swagger
 * /auth/register: 
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - password
 *               - cpf
 *               - telefone
 *               - endereco
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               cpf:
 *                 type: string
 *               telefone:
 *                 type: string
 *               endereco:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Error
 */
router.post('/register', async (req, res) => {
  try {
    const { nome, email, password, role, cpf, telefone, endereco } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ nome, email, password: hashedPassword, role, cpf, telefone, endereco });

    res.status(201).json({
      message: 'User registered',
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        cpf: user.cpf,
        telefone: user.telefone,
        endereco: user.endereco
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /auth/register-vet:
 *   post:
 *     summary: Register a new veterinarian
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - password
 *               - cpf
 *               - telefone
 *               - endereco
 *               - crmv
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               cpf:
 *                 type: string
 *               telefone:
 *                 type: string
 *               endereco:
 *                 type: string
 *               crmv:
 *                 type: string
 *     responses:
 *       201:
 *         description: Veterinarian registered
 *       400:
 *         description: Error
 */
router.post('/register-vet', async (req, res) => {
  try {
    const { nome, email, password, cpf, telefone, endereco, crmv } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      nome, 
      email, 
      password: hashedPassword, 
      role: 'vet', 
      cpf, 
      telefone, 
      endereco,
      crmv 
    });

    res.status(201).json({
      message: 'Veterinarian registered',
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        cpf: user.cpf,
        telefone: user.telefone,
        endereco: user.endereco,
        crmv: user.crmv
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in
 *       400:
 *         description: Error
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        nome: user.nome, 
        email: user.email, 
        role: user.role,
        cpf: user.cpf,
        telefone: user.telefone,
        endereco: user.endereco,
        crmv: user.crmv
      } 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /auth/login-vet:
 *   post:
 *     summary: Login a veterinarian
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Veterinarian logged in
 *       400:
 *         description: Error
 *       401:
 *         description: Invalid credentials
 */
router.post('/login-vet', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.role !== 'vet') return res.status(401).json({ error: 'User is not a veterinarian' });
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        nome: user.nome, 
        email: user.email, 
        role: user.role,
        cpf: user.cpf,
        telefone: user.telefone,
        endereco: user.endereco,
        crmv: user.crmv
      } 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /auth/verify-token:
 *   post:
 *     summary: Verify JWT token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Token is invalid or expired
 */
router.post('/verify-token', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    res.json({ 
      valid: true, 
      user: { 
        id: user.id, 
        nome: user.nome, 
        email: user.email, 
        role: user.role,
        cpf: user.cpf,
        telefone: user.telefone,
        endereco: user.endereco,
        crmv: user.crmv
      } 
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *         schema:
 *           type: object
 *           required:
 *             - email
 *           properties:
 *             email:
 *               type: string
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       400:
 *         description: Error
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // For now, just return a success message
    // In a real app, you would send an email with a reset link
    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
