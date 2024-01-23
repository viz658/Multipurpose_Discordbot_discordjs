const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a banned user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The member you'd like to unban")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for unbanning this member")
    ),
  category: "moderation",
  async execute(interaction, client) {
    const user = interaction.options.getUser("target");
    let reason = interaction.options.getString("reason");

    if (!reason) reason = "No reason provided.";
    if (!interaction.member.permissions.has(PermissionsBitField.BanMembers)) {
      return await interaction.reply({
        content: "You do not have permission to uset his command!",
        ephemeral: true,
      });
    }
    if (interaction.member.id === user.id) {
      return await interaction.reply({
        content: "You cannot unban yourself!",
        ephemeral: true,
      });
    }
    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(
        `✅ ${user.tag} has been unbanned 🔨${reason ? " for " : ""} ${reason}`
      );
    await interaction.guild.bans.fetch().then(async (bans) => {
      if (bans.size == 0) {
        return await interaction.reply({
          content: "No banned users were found!",
          ephemeral: true,
        });
    }
      let bannedID = bans.find((ban) => ban.user.id == user.id);
      if (!bannedID) {
        return await interaction.reply({
          content: "That user is not banned from the server!",
          ephemeral: true,
        });
    }
      await interaction.guild.bans.remove(user.id, reason).catch((err) => {
        return interaction.reply({
          content: "I cannot unban this user!",
          ephemeral: true,
        });
      });
      await interaction.reply({ embeds: [embed] });

    });

  },
};
