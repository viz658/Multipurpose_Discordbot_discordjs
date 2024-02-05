const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("hass")
    .setNSFW(true)
    .setDescription("Get some hentai ass.")
    .setDMPermission(false),
  category: "nsfw",
  async execute(interaction) {
    const res = await fetch(`https://nekobot.xyz/api/image?type=hass`);
    const json = await res.json();
    const embed = new EmbedBuilder()
      .setTitle(`Heres some ass ${interaction.user.username}.`)
      .setImage(json.message)
      .setColor("#f78fef")
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
