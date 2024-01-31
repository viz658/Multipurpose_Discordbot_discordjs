const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("simp")
    .setDescription("Simp rate of a user")
    .setDMPermission(false)
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to analyze")
    ),
  category: "community",
  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    let simpRate = Math.floor(Math.random() * 100);
    let emoji;
    if (simpRate <= 50) emoji = "😐";
    if (simpRate >= 50 && simpRate <= 60) emoji = "🙂";
    if (simpRate >= 60 && simpRate <= 70) emoji = "😀";
    if (simpRate >= 70 && simpRate <= 80) emoji = "😁";
    if (simpRate >= 80 && simpRate <= 90) emoji = "😍";
    if (simpRate >= 90) emoji = "🥵";
    const embed = new EmbedBuilder()
      .setTitle("👀 Simp Rate")
      .setDescription(`${user} is ${simpRate}% simp! ${emoji}`)
      .setColor("#07e8c3")
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
