const mongoose = require('mongoose')
const shortId = require('shortid')

const shortUrlSchema = new mongoose.Schema({
  full: {
    type: String,
    require: true,

  },
  // uses generate function by default to create shortid
  short: {
    type: String,
    required: true,
    default: shortId.generate,
  },
  // clicks variable with default zero of type number
  clicks: {
    type: Number,
    required: true,
    default: 0,
  }
})
// hooks up model with database
module.exports = mongoose.model('ShortUrl', shortUrlSchema)