const { EmbedBuilder } = require("discord.js");
const linkSchema = require("../../schemas/Antilinks.js");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) return;
    if (
      message.content.startsWith("http") ||
      message.content.startsWith("discord.gg") ||
      message.content.includes("https://") ||
      message.content.includes("www.") ||
      message.content.includes("discord.gg/")
    ) {
      let data = await linkSchema.findOne({ Guild: message.guild.id });
      if (!data) return;
      let perms = data.Perms;
      let user = message.author;
      let member = message.guild.members.cache.get(user.id);

      if (member.permissions.has(perms)) return;
      else {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `⚠️${message.author} you can't send links with anti-link enabled.⚠️`
          );
        await message.channel.send({ embeds: [embed] }).then((msg) => {
          setTimeout(() => msg.delete(), 5000);
        });
        await message.delete();
      }
    }
  },
};
