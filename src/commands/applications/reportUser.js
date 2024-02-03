const {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    EmbedBuilder,
  } = require("discord.js");

module.exports = { 
    data: new ContextMenuCommandBuilder()
    .setName("reportUser")
    .setDMPermission(false)
    .setType(ApplicationCommandType.User),
    category: "applications",
    description: "Report a user or server to the developers of the bot",
    async execute(interaction) {
        const member = await interaction.guild.members.fetch(interaction.targetId);
        await interaction.reply({
            content: "This feature is not yet implemented",
            ephemeral: true,
        });
    },
}