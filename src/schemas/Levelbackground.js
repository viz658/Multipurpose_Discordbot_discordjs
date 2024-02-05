const { Schema, model } = require("mongoose");
const levelbackgroundSchema = new Schema({
  guildId: String,
  levelurl: String,
});

module.exports = model("Levelbackgrounds", levelbackgroundSchema);
