const { Schema, model } = require('mongoose');

const guildConfigurationSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  suggestionChannelId: {
    type: String,
  },
});

module.exports = model('GuildConfiguration', guildConfigurationSchema);
