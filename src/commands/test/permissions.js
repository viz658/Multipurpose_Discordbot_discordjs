const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`permissions`)
    .setDescription("permissions test")
    .setDefaultMemberPermissions(0)
    .setDMPermission(false),
  category: "test",
  async execute(interaction, client) {
    const { roles } = interaction.member;
    const role = await interaction.guild.roles
      .fetch("1149879444765421638")
      .catch(console.error);

    const testRole = await interaction.guild.roles
      .create({
        name: "test",
        permissions: [PermissionsBitField.Flags.KickMembers],
      })
      .catch(console.error);

    if (roles.cache.has("1149879444765421638")) {
      await interaction.deferReply({
        fetchReply: true,
      });
      await roles.remove(role).catch(console.error);
      await interaction.editReply({
        content: `Removed ${role.name}`,
      });
    } else {
      await interaction.reply({
        content: `You don't have the role ${role.name}`,
      });
    }

    await roles.add(testRole).catch(console.error);

    await testRole
      .setPermissions([PermissionsBitField.Flags.BanMembers])
      .catch(console.error);

    const channel = await interaction.guild.channels.create({
      name: "test",
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: testRole.id,
          alow: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    });

    await channel.permissionOverwrites
      .edit(testRole.id, {
        SendMessages: false,
      })
      .catch(console.error);
  },
};
