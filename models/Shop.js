const mongoose = require('mongoose')

const ShopSchema = new mongoose.Schema({
  name: String,
  cost: Array,
  description: String,
  owner: String,
  gives: String
}, { collection: 'shop' })

module.exports = mongoose.model('Shop', ShopSchema)