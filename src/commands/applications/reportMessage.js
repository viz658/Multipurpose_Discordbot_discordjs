const {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    EmbedBuilder,
    ModalBuilder
  } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName("reportMessage")
    .setDMPermission(false)
    .setType(ApplicationCommandType.Message),
    category: "applications",
    description: "Report a user or server to the developers of the bot",
    async execute(interaction) { 
        await interaction.reply({
            content: "This feature is not yet implemented",
            ephemeral: true,
        });
    }
}