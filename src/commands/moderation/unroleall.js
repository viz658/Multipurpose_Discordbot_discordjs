const {
    SlashCommandBuilder,
    PermissionsBitField,
    EmbedBuilder,
  } = require("discord.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("unroleall")
      .setDescription("Remove a role from every member")
      .setDMPermission(false)
      .addRoleOption((option) =>
        option
          .setName("role")
          .setDescription("The role you want to unroleall.")
          .setRequired(true)
      ),
    category: "moderation",
    async execute(interaction) {
      const role = interaction.options.getRole("role");
      const members = await interaction.guild.members.fetch();
  
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
      const embed1 = new EmbedBuilder()
        .setColor("Blurple")
        .setDescription(`🔃... Removing the role ${role} from all members`);
      await interaction.reply({ embeds: [embed1], ephemeral: true });
      let membersremoved = 0;
      setTimeout(() => {
        members.forEach(async (member) => {
          member.roles.remove(role).catch((err) => {
            return;
          });
          membersaremoved++;
          const embed2 = new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              `✅Successfully removed the role ${role} to ${membersremoved} members`
            );
  
          await interaction.editReply({ embeds: [embed2], ephemeral: true });
        });
      }, 100);
    },
  };
  