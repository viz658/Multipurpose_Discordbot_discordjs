const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("massunban")
    .setDescription("unban all banned users")
    .setDMPermission(false),
  category: "moderation",
  async execute(interaction, client) {
    const users = await interaction.guild.bans.fetch();
    let owner = await interaction.guild.fetchOwner();
    const ids = users.map((u) => u.user.id);

    if (interaction.user.id !=  owner.id)
      return await interaction.reply({
        content: "You are not the owner of this server",
        ephemeral: true,
      });
    if (!users)
      return await interaction.reply({
        content: "No banned users were found!",
        ephemeral: true,
      });
    await interaction.reply({
      content: `🔃 Unbanning all banned users from your server, this may take a while`,
    });

    for (const id of ids) {
      await interaction.guild.members.unban(id).catch((err) => {
        return interaction.editReply({ content: `${err.rawError}` });
      });
    }

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription(`✅ ${ids.length} users have been unbanned`);

    await interaction.editReply({ content: "", embeds: [embed] });
  },
};
