const {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const Level = require("../../schemas/levelxp.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("resetLevel")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setType(ApplicationCommandType.User),
  category: "applications",
  description: "Reset the level of a user",
  async execute(interaction, client) {
    const member = await interaction.guild.members.fetch(interaction.targetId);
    const query = {
      guildId: interaction.guild.id,
      userId: interaction.targetId,
    };
    let level = await Level.findOne(query);
    if (level.xp > 0 && level.level > 0) {
      await Level.findOneAndUpdate(
        {
          userId: interaction.targetId,
        },
        {
          xp: 0,
          level: 0,
        }
      );
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(`✅${member.user} level reset successfully!`);
      return await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    } else {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("⚠️This user's level is already 0!⚠️");
      return await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
  },
};
