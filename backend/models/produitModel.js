const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
  libelle: {
    type: String,
    required: true
  },
  pu: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Produit', produitSchema);