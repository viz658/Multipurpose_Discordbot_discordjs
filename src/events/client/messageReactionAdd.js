const reactions = require("../../schemas/reactionrs");
const { Events } = require("discord.js");

module.exports = {
  name: "messageReactionAdd",
  async execute(reaction, user, client) {
    if (!reaction.message.guildId) return;
    if (user.bot) return;

    let cId = `<:${reaction.emoji.name}:${reaction.emoji.id}>`;
    if (!reaction.emoji.id) cId = reaction.emoji.name;

    const data = await reactions.findOne({
      Guild: reaction.message.guildId,
      Message: reaction.message.id,
      Emoji: cId,
    });
    if (!data) return;

    const guild = await client.guilds.cache.get(reaction.message.guildId);
    const member = await guild.members.cache.get(user.id);

    try {
      await member.roles.add(data.Role);
    } catch (e) {
      return;
    }
  },
};
