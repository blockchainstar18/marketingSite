const mongoose = require('mongoose')

const Indicator = new mongoose.Schema({
    Link: {
        type: mongoose.Schema.Types.ObjectId,
    },
    Country: {
        type: String
    },
    Language: {
        type: String
    },
    Browser: {
        type: String
    },
    Device: {
        type: String
    },
    TimeOnPage: {
        type: String
    },
    Today: {
        type: String
    }
})

module.exports = mongoose.model('indicator', Indicator)
