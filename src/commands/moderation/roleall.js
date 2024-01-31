const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roleall")
    .setDescription("Apply a role to every member")
    .setDMPermission(false)
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role you want to roleall.")
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
      .setDescription(`🔃... Giving all members the role ${role} `);
    await interaction.reply({ embeds: [embed1], ephemeral: true });
    let membersadded = 0;
    setTimeout(() => {
      members.forEach(async (member) => {
        member.roles.add(role).catch((err) => {
          return;
        });
        membersadded++;
        const embed2 = new EmbedBuilder()
          .setColor("Green")
          .setDescription(
            `✅Successfully gave the role ${role} to ${membersadded} members`
          );

        await interaction.editReply({ embeds: [embed2], ephemeral: true });
      });
    }, 100);
  },
};
