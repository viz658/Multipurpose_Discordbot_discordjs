const {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("menu")
    .setDescription("Menu test")
    .setDefaultMemberPermissions(0)
    .setDMPermission(false),
  category: "test",
  async execute(interaction, client) {
    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("sub-menu")
        .setPlaceholder("Nothing selected")
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel("Select me")
            .setDescription("This is a description")
            .setValue("first_option")
            .setDefault(true),
          new StringSelectMenuOptionBuilder()
            .setLabel("You can select me too")
            .setDescription("This is also a description")
            .setValue("second_option")
        )
    );
    await interaction.reply({
      content: "Select menu test",
      components: [row],
    });
  },
};
