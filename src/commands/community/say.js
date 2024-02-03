const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Make the bot say something")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to say")
        .setMaxLength(30)
        .setRequired(true)
    ),
  category: "community",
  async execute(interaction) {
    if (
      interaction.options.getString("message").includes("http") ||
      interaction.options.getString("message").includes("https") ||
      interaction.options.getString("message").includes("www") ||
      interaction.options.getString("message").includes("discord.gg") ||
      interaction.options.getString("message").includes("discord.com") ||
      interaction.options.getString("message").includes("discordapp.com") ||
      interaction.options.getString("message").includes("discord.com") ||
      interaction.options.getString("message").startsWith("discord.gg")
    ) {
      return await interaction.reply({
        content: "You cannot make the bot send a message with a link",
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setDescription(interaction.options.getString("message"))
      .setColor("Random")
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });
    await interaction.reply({ embeds: [embed] });
  },
};
