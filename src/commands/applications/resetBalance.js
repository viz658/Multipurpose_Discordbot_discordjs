const {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  EmbedBuilder,
  PermissionsBitField
} = require("discord.js");
const Balance = require("../../schemas/balance");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("resetBalance")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setType(ApplicationCommandType.User),
  category: "applications",
  description: "Reset the balance of a user",
  async execute(interaction, client) {
    const fetchedbalance = await client.fetchBalance(
      interaction.targetId,
      interaction.guild.id
    );
    const member = await interaction.guild.members.fetch(interaction.targetId);
    //check if fetchedbalance is already 0
    if (fetchedbalance.balance === 0) {
        const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("⚠️This user's balance is already 0!⚠️")
      return await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    } else {
        await Balance.findOneAndUpdate(
            {
              _id: fetchedbalance._id,
            },
            {
              balance: 0,
            }
          );
        const embed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(`✅${member.user} balance reset successfully!`)
      
      return await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
  },
};
