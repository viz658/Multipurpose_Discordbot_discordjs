const { Schema, model } = require("mongoose");

const spamdetectsetupSchema = new Schema({
    Guild: String,
    Channel: String
})

module.exports = model("spamdetectsetup", spamdetectsetupSchema);