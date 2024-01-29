const {
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reportbug")
    .setDescription(
      "Report a bug or exploit encountered with Vizguard to notify devs"
    ),

  category: "community",
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setTitle("Bug & explot report")
      .setCustomId("bugreport");

    const command = new TextInputBuilder()
      .setCustomId("command")
      .setRequired(true)
      .setPlaceholder("Enter only the name of the command")
      .setLabel("The command that has a bug or exploit")
      .setStyle(TextInputStyle.Short);

    const description = new TextInputBuilder()
      .setCustomId("description")
      .setRequired(true)
      .setPlaceholder("Enter a detailed description of the bug or exploit")
      .setLabel("Desciption of bug or exploit")
      .setStyle(TextInputStyle.Paragraph);

    const actionrow1 = new ActionRowBuilder().addComponents(command);
    const actionrow2 = new ActionRowBuilder().addComponents(description);

    modal.addComponents(actionrow1, actionrow2);

    await interaction.showModal(modal);
  },
};
