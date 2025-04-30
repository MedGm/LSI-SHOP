const mongoose = require('mongoose');

const ligneCmdSchema = new mongoose.Schema({
  commande: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Commande'
  },
  produit: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Produit'
  },
  qte: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for getting the total price per line
ligneCmdSchema.virtual('total').get(function() {
  if (this.produit && typeof this.produit.pu === 'number') {
    return this.qte * this.produit.pu;
  }
  return 0;
});

module.exports = mongoose.model('LigneCmd', ligneCmdSchema);