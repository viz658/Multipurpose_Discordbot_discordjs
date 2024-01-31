const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stank")
    .setDescription("Stank rate of a user")
    .setDMPermission(false)
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to sniff test")
    ),
  category: "community",
  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    let stankRate = Math.floor(Math.random() * 100);
    let emoji = "";
    if (stankRate <= 50) emoji = "👃🏻🤢";
    if (stankRate >= 50 && stankRate <= 60) emoji = "👃🏻🤮";
    if (stankRate >= 60 && stankRate <= 70) emoji = "👃🏻🤧";
    if (stankRate >= 70 && stankRate <= 80) emoji = "👃🏻🤤";
    if (stankRate >= 80 && stankRate <= 90) emoji = "👃🏻😋";
    if (stankRate >= 90) emoji = "👃🏻😍";
    const embed = new EmbedBuilder()
      .setTitle("💨 Stank Rate")
      .setDescription(`${user} is ${stankRate}% stank! ${emoji}`)
      .setColor("#076930")
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
