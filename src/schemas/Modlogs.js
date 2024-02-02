const { Schema, model } = require('mongoose');
const modlogs = new Schema({
    Guild: String,
    Channel: String
    
})

module.exports = model('modlogs', modlogs)