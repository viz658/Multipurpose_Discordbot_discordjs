const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("button")
    .setDescription("Button test")
    .setDefaultMemberPermissions(0),
    category: "community",
  async execute(interaction, client) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("sub-yt")
        .setLabel("Clik here to subscribe to my YouTube channel")
        .setStyle(ButtonStyle.Primary)
    );
    await interaction.reply({
      components: [row]
    });
  },
};
