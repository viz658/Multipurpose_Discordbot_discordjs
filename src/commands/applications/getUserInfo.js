const {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("getUserInfo")
    .setDMPermission(false)
    .setType(ApplicationCommandType.User),
  category: "applications",
  async execute(interaction) {
    const member = await interaction.guild.members.fetch(interaction.targetId);
    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setAuthor({
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL(),
      })
      .setThumbnail(member.user.displayAvatarURL())
      .addFields({ name: "Member", value: `${member.user.tag}`, inline: false })
      .addFields({
        name: "Roles",
        value: member.roles.cache.map((r) => r).join(" "),
        inline: false,
      })
      .addFields({
        name: "Joined at",
        value: `<t:${parseInt(member.joinedAt / 1000)}:R>`,
        inline: true,
      })
      .addFields({
        name: "Created at",
        value: `<t:${parseInt(member.user.createdAt / 1000)}:R>`,
        inline: true,
      })
      .setFooter({ text: `User ID: ${member.user.id}` })
      .setTimestamp();
    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
