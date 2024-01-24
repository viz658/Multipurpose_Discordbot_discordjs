const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Get info on an user")
    .addUserOption((option) =>
      option.setName("target").setDescription("The user you'd like to info on")
    ),
  category: "community",
  async execute(interaction, client) {
    const user = interaction.options.getUser("target") || interaction.user;
    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(console.error);
    const icon = user.displayAvatarURL();
    const tag = user.tag;

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setAuthor({ name: tag, iconURL: icon })
      .setThumbnail(icon)
      .addFields({ name: "Member", value: `${user.tag}`, inline: false })
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
        value: `<t:${parseInt(user.createdAt / 1000)}:R>`,
        inline: true,
      })
      .setFooter({ text: `User ID: ${user.id}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
