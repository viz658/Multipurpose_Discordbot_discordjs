const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("banlist")
    .setDescription("Return list of banned users")
    .setDMPermission(false),
  category: "moderation",
  async execute(interaction, client) {
    await interaction.guild.bans.fetch().then(async (bans) => {
      if (bans.size == 0) {
        return await interaction.reply({
          content: "No banned users were found!",
          ephemeral: true,
        });
      }
      const embed = new EmbedBuilder()
        .setTitle("List of banned members")
        .setColor("Blurple");
      bans.forEach((ban) =>
        embed.addFields({
          name: ban.user.tag,
          value: ban.reason || "No reason provided.",
        })
      );
      await interaction.reply({ embeds: [embed] });
    });
  },
};
