const { Schema, model } = require('mongoose');
const antiBot = new Schema({
    Guild: String,
    WhitelistedBots: Array
    
})

module.exports = model('antiBot', antiBot)