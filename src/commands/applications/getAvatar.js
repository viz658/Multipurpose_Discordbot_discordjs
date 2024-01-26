const { ApplicationCommandType, ContextMenuCommandBuilder } = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("getAvatar")
    .setDMPermission(false)
    .setType(ApplicationCommandType.User),
    category: "applications",
  async execute(interaction, client) {
    await interaction.reply({
      content: `${interaction.targetUser.displayAvatarURL()}`,
    });
  },
};
