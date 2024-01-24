const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("timeout member ")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The member you'd like to timeout")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("time")
        .setDescription(
          "The time (minutes) you'd like to timeout this member for"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for putting this member in timeout")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  category: "moderation",
  async execute(interaction, client) {
    const user = interaction.options.getUser("target");
    let reason = interaction.options.getString("reason") || "";
    const time = interaction.options.getInteger("time");
    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(console.error);

    if (!time) time = null;

    await user
      .send({
        content: `You have been put in timeout in ${interaction.guild.name} ${reason ? " for " : ""} ${reason} for ${time} minutes`,
      })
      .catch(() => console.log("User's DM's are off."));

    await member.timeout(time == null ? null : time * 60 * 1000, reason).catch(console.error);

    await interaction.reply({
      content: `${user.tag} has been put in timeout for ${reason} ${reason ? " for " : ""} ${time} minutes`,
    });
  },
};
