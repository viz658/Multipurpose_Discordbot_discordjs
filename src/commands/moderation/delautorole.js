const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");
const Autoroles = require("../../schemas/autoroles.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("delautorole")
    .setDescription("Remove a role from autorole system.")
    .setDMPermission(false)
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role you want to remove autorole from.")
        .setRequired(true)
    ),
  category: "moderation",
  async execute(interaction, client) {
    const role = interaction.options.getRole("role");
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "⚠️You do not have administrator permission to use this command.⚠️"
        );
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }
    const data = await Autoroles.findOne({
      GuildID: interaction.guild.id,
      RoleID: role.id,
    });
    if (!data) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("⚠️This role is not set as autorole.⚠️");
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    } else {
      await data.deleteOne();
    }
    const embed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(`✅Successfully deleted the role ${role} from autorole.`);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
