// Import required dependencies
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');

// Initialize Express application
const app = express();

// Enable CORS and parse incoming JSON
app.use(cors());
app.use(bodyParser.json());

// Define API routes
app.use('/api', userRoutes);

// Start the server on port 5000
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
