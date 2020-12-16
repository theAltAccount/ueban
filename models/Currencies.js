const mongoose = require('mongoose')

const CurrencySchema = new mongoose.Schema({
  name: String,
  value: String
}, { collection: 'currencies' })

module.exports = mongoose.model('Currency', CurrencySchema)