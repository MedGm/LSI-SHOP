const express = require('express');
const router = express.Router();
const { 
  getLignesCmd, 
  getLignesCmdByCommande, 
  createLigneCmd, 
  updateLigneCmd, 
  deleteLigneCmd 
} = require('../controllers/ligneCmdController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// @route   GET /api/ligneCmd
// @desc    Get all order lines
// @access  Private
router.get('/', getLignesCmd);

// @route   GET /api/ligneCmd/commande/:id
// @desc    Get order lines by order ID
// @access  Private
router.get('/commande/:id', getLignesCmdByCommande);

// @route   POST /api/ligneCmd
// @desc    Create a new order line
// @access  Private
router.post('/', createLigneCmd);

// @route   PUT /api/ligneCmd/:id
// @desc    Update an order line
// @access  Private
router.put('/:id', updateLigneCmd);

// @route   DELETE /api/ligneCmd/:id
// @desc    Delete an order line
// @access  Private
router.delete('/:id', deleteLigneCmd);

module.exports = router;