const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  id: String,
  money: Array
}, { collection: 'users' })

module.exports = mongoose.model('User', UserSchema)