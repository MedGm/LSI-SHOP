const express = require('express');
const router = express.Router();
const { 
  getProduits, 
  getProduitById, 
  createProduit, 
  updateProduit, 
  deleteProduit 
} = require('../controllers/produitController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// @route   GET /api/produits
// @desc    Get all products
// @access  Private
router.get('/', getProduits);

// @route   GET /api/produits/:id
// @desc    Get product by ID
// @access  Private
router.get('/:id', getProduitById);

// @route   POST /api/produits
// @desc    Create a new product
// @access  Private
router.post('/', createProduit);

// @route   PUT /api/produits/:id
// @desc    Update a product
// @access  Private
router.put('/:id', updateProduit);

// @route   DELETE /api/produits/:id
// @desc    Delete a product
// @access  Private
router.delete('/:id', deleteProduit);

module.exports = router;