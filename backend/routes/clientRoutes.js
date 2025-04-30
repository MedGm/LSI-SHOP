const express = require('express');
const router = express.Router();
const { 
  getClients, 
  getClientById, 
  createClient, 
  updateClient, 
  deleteClient 
} = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// @route   GET /api/clients
// @desc    Get all clients
// @access  Private
router.get('/', getClients);

// @route   GET /api/clients/:id
// @desc    Get client by ID
// @access  Private
router.get('/:id', getClientById);

// @route   POST /api/clients
// @desc    Create a new client
// @access  Private
router.post('/', createClient);

// @route   PUT /api/clients/:id
// @desc    Update a client
// @access  Private
router.put('/:id', updateClient);

// @route   DELETE /api/clients/:id
// @desc    Delete a client
// @access  Private
router.delete('/:id', deleteClient);

module.exports = router;