const { Schema, model } = require("mongoose");
const leaderboardbackgroundSchema = new Schema({
  guildId: String,
  leaderboardurl: String,
});

module.exports = model("Leaderboardbackgrounds", leaderboardbackgroundSchema);
