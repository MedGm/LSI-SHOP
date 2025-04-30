const LigneCmd = require('../models/ligneCmdModel');
const Produit = require('../models/produitModel');

// @desc    Get all order lines
// @route   GET /api/ligneCmd
// @access  Private
const getLignesCmd = async (req, res) => {
  try {
    const lignesCmd = await LigneCmd.find({})
      .populate('commande', 'date')
      .populate('produit', 'libelle pu');
    
    res.json(lignesCmd);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order lines by order ID
// @route   GET /api/ligneCmd/commande/:id
// @access  Private
const getLignesCmdByCommande = async (req, res) => {
  try {
    const lignesCmd = await LigneCmd.find({ commande: req.params.id })
      .populate('produit', 'libelle pu');
    
    res.json(lignesCmd);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an order line
// @route   POST /api/ligneCmd
// @access  Private
const createLigneCmd = async (req, res) => {
  try {
    const { commande, produit, qte } = req.body;
    
    if (!commande || !produit || !qte) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if product exists and get its price
    const produitInfo = await Produit.findById(produit);
    if (!produitInfo) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if same product already exists in the order
    const existingLine = await LigneCmd.findOne({ commande, produit });
    
    if (existingLine) {
      // Update quantity if line already exists
      existingLine.qte += Number(qte);
      await existingLine.save();
      
      // Populate product info for response
      await existingLine.populate('produit', 'libelle pu');
      
      return res.json(existingLine);
    }
    
    // Create new order line
    const ligneCmd = await LigneCmd.create({
      commande,
      produit,
      qte: Number(qte)
    });
    
    // Populate product info for response
    await ligneCmd.populate('produit', 'libelle pu');
    
    res.status(201).json(ligneCmd);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an order line
// @route   PUT /api/ligneCmd/:id
// @access  Private
const updateLigneCmd = async (req, res) => {
  try {
    const { qte } = req.body;
    
    const ligneCmd = await LigneCmd.findById(req.params.id);
    
    if (!ligneCmd) {
      return res.status(404).json({ message: 'Order line not found' });
    }
    
    if (qte !== undefined && qte > 0) {
      ligneCmd.qte = Number(qte);
      const updatedLigneCmd = await ligneCmd.save();
      
      // Populate product info for response
      await updatedLigneCmd.populate('produit', 'libelle pu');
      
      res.json(updatedLigneCmd);
    } else if (qte !== undefined && qte <= 0) {
      // If quantity is 0 or negative, delete the line
      await ligneCmd.deleteOne();
      res.json({ message: 'Order line removed due to zero or negative quantity' });
    } else {
      res.status(400).json({ message: 'Quantity update is required' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an order line
// @route   DELETE /api/ligneCmd/:id
// @access  Private
const deleteLigneCmd = async (req, res) => {
  try {
    const ligneCmd = await LigneCmd.findById(req.params.id);
    
    if (!ligneCmd) {
      return res.status(404).json({ message: 'Order line not found' });
    }
    
    await ligneCmd.deleteOne();
    
    res.json({ message: 'Order line removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLignesCmd,
  getLignesCmdByCommande,
  createLigneCmd,
  updateLigneCmd,
  deleteLigneCmd,
};