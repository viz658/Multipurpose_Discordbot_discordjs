const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("kick member from server")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The member you'd like to kick")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for kicking this member")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  category: "moderation",
  async execute(interaction, client) {
    const user = interaction.options.getUser("target");
    let reason = interaction.options.getString("reason") || "";
    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(console.error);

    await user
      .send({
        content: `You have been kicked from ${interaction.guild.name} ${
          reason ? " for " : ""
        } ${reason}`,
      })
      .catch(() => console.log("User's DM's are off."));

    await member.kick(reason).catch(console.error);
    const embed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(
        `✅ ${user.tag} has been kicked 🔨${reason ? " for " : ""} ${reason}`
      )
      .setTimestamp(Date.now());
    await interaction.reply({
      embeds: [embed],
    });
  },
};
