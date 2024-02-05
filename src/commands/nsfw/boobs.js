const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("boobs")
    .setNSFW(true)
    .setDescription("Look at boobs.")
    .setDMPermission(false),
  category: "nsfw",
  async execute(interaction) {
    const res = await fetch(`https://nekobot.xyz/api/image?type=boobs`);
    const json = await res.json();
    const embed = new EmbedBuilder()
      .setTitle(
        `Heres some boobs we know you dont get some ${interaction.user.username}.`
      )
      .setImage(json.message)
      .setColor("#f78fef")
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
