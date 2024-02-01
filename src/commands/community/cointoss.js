const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cointoss")
    .setDMPermission(false)
    .setDescription("Toss a coin."),
  category: "community",
  async execute(interaction) {
    const user = interaction.user;
    const embed = new EmbedBuilder();

    const result = Math.random() < 0.5 ? "heads" : "tails";

    embed
      .setColor("Random")
      .setTitle("🪙 Coin Toss")
      .setDescription(`You got ${result}!`)

    await interaction.reply({ embeds: [embed] });
  },
};
