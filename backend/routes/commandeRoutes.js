const express = require('express');
const router = express.Router();
const { 
  getCommandes, 
  getCommandeById, 
  createCommande, 
  updateCommande, 
  deleteCommande 
} = require('../controllers/commandeController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// @route   GET /api/commandes
// @desc    Get all orders
// @access  Private
router.get('/', getCommandes);

// @route   GET /api/commandes/:id
// @desc    Get order by ID with its lines
// @access  Private
router.get('/:id', getCommandeById);

// @route   POST /api/commandes
// @desc    Create a new order with order lines
// @access  Private
router.post('/', createCommande);

// @route   PUT /api/commandes/:id
// @desc    Update an order
// @access  Private
router.put('/:id', updateCommande);

// @route   DELETE /api/commandes/:id
// @desc    Delete an order and its lines
// @access  Private
router.delete('/:id', deleteCommande);

module.exports = router;