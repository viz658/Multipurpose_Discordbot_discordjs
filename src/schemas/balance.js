const { Schema, model } = require("mongoose");
const balanceSchema = new Schema({
  _id: Schema.Types.ObjectId,
  userId: String,
  guildId: String,
  balance: { type: Number, default: 0 },
  lastDaily: {
    type: Date,
    default: new Date(new Date().setDate(new Date().getDate() - 1)),
    required: true,
  },
  bank: { type: Number, default: 0 },

});

module.exports = model("Balance", balanceSchema, "balances");
