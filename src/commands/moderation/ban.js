const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban member from server")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The member you'd like to ban")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("time")
        .setDescription(
          "The time's worth of messages you'd like to purge from this member (in days)"
        )
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for banning this member")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  category: "moderation",
  async execute(interaction, client) {
    const user = interaction.options.getUser("target");
    let reason = interaction.options.getString("reason") || "";
    const time = interaction.options.getInteger("time");
    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(console.error);

    if (interaction.member.id === user.id) {
      return await interaction.reply({
        content: "You cannot ban yourself!",
        ephemeral: true,
      });
    }
    await user
      .send({
        content: `You have been banned from ${interaction.guild.name} ${reason ? " for " : ""} ${reason}`,
      })
      .catch(console.log("User's DM's are off."));

    await member
      .ban({ deleteMessageSeconds: time * 60 * 60 * 24, reason: reason })

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(
        `✅ ${user.tag} has been banned 🔨${reason ? " for " : ""} ${reason}`
      );
    await interaction.reply({
      embeds: [embed],
    });
  },
};
