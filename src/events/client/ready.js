const chalk = require("chalk");
const bot = require("../../schemas/antibot.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(chalk.bgGreen(`${client.user.tag} is online`));
    //anti bot system
    setInterval(async () => {
      const data = await bot.find();
      if (!data) return;
      data.forEach(async (g) => {
        const guild = client.guilds.cache.get(g.Guild);
        if (!guild) return;
        var members = await guild.members.fetch();
        await members.forEach(async (member) => {
          if (g.WhitelistedBots.includes(member.user.id)) return;
          if (member.user.bot && member.id !== client.user.id) {
            return await member
              .kick("Anti bot system is enabled in this server")
              .catch((err) => {});
          }
            else return;
        });
      });
    }, 10000);
  },
};
