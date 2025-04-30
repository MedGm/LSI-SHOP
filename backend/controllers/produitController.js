const Produit = require('../models/produitModel');

// @desc    Get all products
// @route   GET /api/produits
// @access  Private
const getProduits = async (req, res) => {
  try {
    const produits = await Produit.find({});
    res.json(produits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a product by ID
// @route   GET /api/produits/:id
// @access  Private
const getProduitById = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);
    
    if (produit) {
      res.json(produit);
    } else {
      res.status(404).json({ message: 'Produit not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/produits
// @access  Private
const createProduit = async (req, res) => {
  try {
    const { libelle, pu } = req.body;

    if (!libelle || !pu) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    const produit = await Produit.create({
      libelle,
      pu
    });

    res.status(201).json(produit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/produits/:id
// @access  Private
const updateProduit = async (req, res) => {
  try {
    const { libelle, pu } = req.body;
    
    const produit = await Produit.findById(req.params.id);
    
    if (!produit) {
      return res.status(404).json({ message: 'Produit not found' });
    }
    
    produit.libelle = libelle || produit.libelle;
    produit.pu = pu !== undefined ? pu : produit.pu;
    
    const updatedProduit = await produit.save();
    
    res.json(updatedProduit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/produits/:id
// @access  Private
const deleteProduit = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);
    
    if (!produit) {
      return res.status(404).json({ message: 'Produit not found' });
    }
    
    await produit.deleteOne();
    
    res.json({ message: 'Produit removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProduits,
  getProduitById,
  createProduit,
  updateProduit,
  deleteProduit,
};