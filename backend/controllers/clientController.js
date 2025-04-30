const Client = require('../models/clientModel');

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private
const getClients = async (req, res) => {
  try {
    const clients = await Client.find({});
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a client by ID
// @route   GET /api/clients/:id
// @access  Private
const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    
    if (client) {
      res.json(client);
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a client
// @route   POST /api/clients
// @access  Private
const createClient = async (req, res) => {
  try {
    const { nom, age, email } = req.body;

    if (!nom || !age || !email) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if client with this email already exists
    const clientExists = await Client.findOne({ email });

    if (clientExists) {
      return res.status(400).json({ message: 'Client with this email already exists' });
    }

    const client = await Client.create({
      nom,
      age,
      email,
    });

    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a client
// @route   PUT /api/clients/:id
// @access  Private
const updateClient = async (req, res) => {
  try {
    const { nom, age, email } = req.body;
    
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    // Check if email is changed and if it already exists
    if (email && email !== client.email) {
      const clientWithEmail = await Client.findOne({ email });
      if (clientWithEmail) {
        return res.status(400).json({ message: 'Client with this email already exists' });
      }
    }
    
    client.nom = nom || client.nom;
    client.age = age || client.age;
    client.email = email || client.email;
    
    const updatedClient = await client.save();
    
    res.json(updatedClient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a client
// @route   DELETE /api/clients/:id
// @access  Private
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    await client.deleteOne();
    
    res.json({ message: 'Client removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};