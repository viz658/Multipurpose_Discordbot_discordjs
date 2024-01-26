const { Schema, model } = require("mongoose");
const autorolesSchema = new Schema({
  _id: Schema.Types.ObjectId,
  GuildID: String,
  RoleID: String,
});

module.exports = model("Autoroles", autorolesSchema);
