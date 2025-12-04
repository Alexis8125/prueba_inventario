const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // O tu frontend
  credentials: true
}));
app.use(express.json());

// Rutas de email
app.use('/api/email', require('./routes/email'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    service: 'Email Service',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`📧 Servicio de Emails en http://localhost:${PORT}`);
});