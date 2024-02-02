const { model, Schema } = require("mongoose");

let automodSchema = new Schema({
  Guild: String,
 // isEnabled: Boolean,
});

module.exports = model("automod", automodSchema);
