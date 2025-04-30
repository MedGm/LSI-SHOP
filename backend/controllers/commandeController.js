const Commande = require('../models/commandeModel');
const LigneCmd = require('../models/ligneCmdModel');

// @desc    Get all orders
// @route   GET /api/commandes
// @access  Private
const getCommandes = async (req, res) => {
  try {
    const commandes = await Commande.find({})
      .populate('client', 'nom email');
    res.json(commandes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get an order by ID with its lines
// @route   GET /api/commandes/:id
// @access  Private
const getCommandeById = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id)
      .populate('client', 'nom email');
    
    if (!commande) {
      return res.status(404).json({ message: 'Commande not found' });
    }
    
    // Get order lines
    const lignes = await LigneCmd.find({ commande: commande._id })
      .populate('produit', 'libelle pu');
    
    res.json({
      ...commande.toJSON(),
      lignes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an order with order lines
// @route   POST /api/commandes
// @access  Private
const createCommande = async (req, res) => {
  try {
    const { client, date, lignes } = req.body;
    
    if (!client) {
      return res.status(400).json({ message: 'Client is required' });
    }
    
    // Create commande
    const commande = await Commande.create({
      client,
      date: date || new Date()
    });
    
    // Create order lines if provided
    if (lignes && lignes.length > 0) {
      const orderLines = await Promise.all(
        lignes.map(ligne => 
          LigneCmd.create({
            commande: commande._id,
            produit: ligne.produit,
            qte: ligne.qte
          })
        )
      );
      
      return res.status(201).json({
        commande,
        lignes: orderLines
      });
    }
    
    res.status(201).json({ commande });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an order
// @route   PUT /api/commandes/:id
// @access  Private
const updateCommande = async (req, res) => {
  try {
    const { client, date } = req.body;
    
    const commande = await Commande.findById(req.params.id);
    
    if (!commande) {
      return res.status(404).json({ message: 'Commande not found' });
    }
    
    commande.client = client || commande.client;
    commande.date = date || commande.date;
    
    const updatedCommande = await commande.save();
    
    res.json(updatedCommande);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an order and its lines
// @route   DELETE /api/commandes/:id
// @access  Private
const deleteCommande = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id);
    
    if (!commande) {
      return res.status(404).json({ message: 'Commande not found' });
    }
    
    // Delete all order lines first
    await LigneCmd.deleteMany({ commande: commande._id });
    
    // Delete the order
    await commande.deleteOne();
    
    res.json({ message: 'Commande and its lines removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCommandes,
  getCommandeById,
  createCommande,
  updateCommande,
  deleteCommande,
};