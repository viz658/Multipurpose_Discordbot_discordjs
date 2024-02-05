const {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
  } = require("discord.js");
  const Balance = require("../../schemas/balance");
  
  module.exports = {
    data: new ContextMenuCommandBuilder()
      .setName("resetBank")
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
      .setType(ApplicationCommandType.User),
    category: "applications",
    description: "Reset the bank of a user",
    async execute(interaction, client) {
      const member = await interaction.guild.members.fetch(interaction.targetId);
      if (member.user.bot) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription("⚠️You can't reset the bank of a bot!⚠️");
        return await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }
      const fetchedbalance = await client.fetchBalance(
        interaction.targetId,
        interaction.guild.id
      );
  
      //check if fetchedbalance is already 0
      if (fetchedbalance.balance === 0) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription("⚠️This user's bank is already 0!⚠️");
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
            bank: 0,
          }
        );
        const embed = new EmbedBuilder()
          .setColor("Green")
          .setDescription(`✅${member.user} bank reset successfully!`);
  
        return await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }
    },
  };
  