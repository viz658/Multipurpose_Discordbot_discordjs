const {
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("modal")
    .setDescription("Modal test")
    .setDefaultMemberPermissions(0)
    .setDMPermission(false),
  category: "test",
  async execute(interaction, client) {
    const modal = new ModalBuilder().setTitle("Modal").setCustomId("fav-color");

    const textInput = new TextInputBuilder()
      .setCustomId("favColorInput")
      .setLabel("What is your favorite color?")
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    modal.addComponents(new ActionRowBuilder().addComponents(textInput));
    await interaction.showModal(modal);
  },
};
