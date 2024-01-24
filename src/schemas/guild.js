const { Schema, model } = require("mongoose");
const guildSchema = new Schema({
  _id: Schema.Types.ObjectId,
  guildId: String,
  guildName: String,
  guildIcon: { type: String, required: false },
  guildCreationDate: { type: Date, default: Date.now()},
  guildMembers: { type: Number, default: 0 },
});

module.exports = model("Guild", guildSchema, "guilds");
