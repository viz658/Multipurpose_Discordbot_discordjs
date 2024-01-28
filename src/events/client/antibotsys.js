const bot = require("../../schemas/antibot.js");

module.exports = {
  name: "guildMemberAdd",
  async execute(member, client) {
    const data = await bot.findOne({ Guild: member.guild.id });
    if (!data) {
      return;
    } else {
      if (data.WhitelistedBots.includes(member.user.id)) {
        return;
      } else if (member.user.bot && member.id !== client.user.id) {
        return await member
          .kick("Anti bot system is enabled in this server")
          .catch((err) => {
            
          });
      } else {
        return;
      }
    }
  },
};
