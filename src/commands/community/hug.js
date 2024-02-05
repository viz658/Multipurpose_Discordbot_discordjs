const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("hug")
    .setDescription("Hug someone!")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to hug")
        .setRequired(true)
    ),
  category: "community",
  async execute(interaction, client) {
    const user = interaction.options.getUser("user");
    if (user.id === interaction.user.id)
      return await interaction.reply({
        content: "Bro needs to hug himself 🤣.",
        ephemeral: true,
      });

    if (user.id === client.user.id)
      return await interaction.reply({
        content: "Don't touch me 🤬!",
        ephemeral: true,
      });
    if (user.bot)
      return await interaction.reply({
        content: "Bots don't need hugs 😂.",
        ephemeral: true,
      });
    const res = await fetch(`https://nekobot.xyz/api/image?type=ass`);
    const json = await res.json();
    const embed = new EmbedBuilder()
      .setTitle(`${interaction.user.username} hugged ${user.username}!`)
      .setImage(json.message)
      .setColor("#f78fef")
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
