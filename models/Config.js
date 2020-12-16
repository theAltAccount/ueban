const mongoose = require('mongoose')

const ConfigSchema = new mongoose.Schema({
  prefix: String,
  owner: String,
  activereward: Array
}, { collection: 'config' })

module.exports = mongoose.model('Config', ConfigSchema)