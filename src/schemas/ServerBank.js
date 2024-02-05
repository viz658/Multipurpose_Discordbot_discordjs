const { Schema, model } = require("mongoose");
const serverBankSchema = new Schema({
  _id: Schema.Types.ObjectId,
  guildId: String,
  bank: { type: Number, default: 10000 },
});

module.exports = model("Serverbank", serverBankSchema);
