const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("thigh")
    .setNSFW(true)
    .setDescription("Look at thighs.")
    .setDMPermission(false),
  category: "nsfw",
  async execute(interaction) {
    const res = await fetch(`https://nekobot.xyz/api/image?type=thigh`);
    const json = await res.json();
    const embed = new EmbedBuilder()
      .setTitle(`Heres some thigh ${interaction.user.username}.`)
      .setImage(json.message)
      .setColor("#f78fef")
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
