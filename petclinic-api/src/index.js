require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Swagger setup
const { swaggerUi, swaggerSpec } = require('./swagger');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const petRoutes = require('./routes/pet');
const examRoutes = require('./routes/exam');
const appointmentRoutes = require('./routes/appointment');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/appointments', appointmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api/docs`);
});
