const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ass")
    .setNSFW(true)
    .setDescription("Get some ass.")
    .setDMPermission(false),
  category: "nsfw",
  async execute(interaction) {
    const res = await fetch(`https://nekobot.xyz/api/image?type=ass`);
    const json = await res.json();
    const embed = new EmbedBuilder()
      .setTitle(`Heres some ass ${interaction.user.username}.`)
      .setImage(json.message)
      .setColor("#f78fef")
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
