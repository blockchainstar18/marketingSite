const mongoose = require('mongoose')

const ShortenLinkSchema = new mongoose.Schema({
    originLink: {
        type: String,
        required: true,
        unique: true
    },
    shortenLink: {
        type: String,
        required: true,
        unique: true
    }

})

module.exports = mongoose.model('shortenLink', ShortenLinkSchema)