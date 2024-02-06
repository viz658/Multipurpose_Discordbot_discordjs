const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("timeout member ")
    .setDMPermission(false)
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
    let time = interaction.options.getInteger("time");
    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(console.error);

      let string =  `You have been put in timeout in ${interaction.guild.name} ${
        reason ? " for " : ""
      } ${reason} for ${time} minutes`;
      let descstring = `✅ ${user.tag} has been put in timeout ⌛${
        reason ? " for " : ""
      } ${reason} for ${time} minutes`;
    if (time==0) {
      time = null;
      string = `Your timeout in ${interaction.guild.name} has been lifted!`
      descstring = `✅ ${user.tag}'s timeout has been lifted!`
    }
    
    await user
      .send({
        content: `${string}`,
      })
      .catch(() => console.log("User's DM's are off."));
      let timeouttime = time === null ? null : time * 60 * 1000;
    await member
      .timeout(timeouttime , reason)
      .catch(console.error);
    const embed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(
        `${descstring}`
      )
      .setTimestamp(Date.now());
    await interaction.reply({
      embeds: [embed], ephemeral: true
    });
  },
};
