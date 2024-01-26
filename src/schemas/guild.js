const { Schema, model } = require("mongoose");
const guildSchema = new Schema({
  _id: Schema.Types.ObjectId,
  guildId: String,
  guildCreationDate: { type: Date, default: Date.now()},
});

module.exports = model("Guild", guildSchema, "guilds");
