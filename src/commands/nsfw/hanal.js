const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("hanal")
    .setNSFW(true)
    .setDescription("Look at hentai anal.")
    .setDMPermission(false),
  category: "nsfw",
  async execute(interaction) {
    const res = await fetch(`https://nekobot.xyz/api/image?type=hanal`);
    const json = await res.json();
    const embed = new EmbedBuilder()
      .setTitle(`Heres anal ${interaction.user.username}.`)
      .setImage(json.message)
      .setColor("#f78fef")
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
