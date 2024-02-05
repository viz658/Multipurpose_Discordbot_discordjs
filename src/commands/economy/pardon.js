const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const Balance = require("../../schemas/balance");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pardon")
    .setDescription("Pardon a user from jail.")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to pardon.")
        .setRequired(true)
    ),
  category: "economy",
  async execute(interaction, client) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "⚠️You do not have the required permissions to use this command.⚠️"
        );
      return await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
    const user = interaction.options.getUser("user");
    const userBalance = await client.fetchBalance(
      user.id,
      interaction.guild.id
    );
    if (!userBalance.inJail) {
      return await interaction.reply({
        content: "This user is not in jail!",
        ephemeral: true,
      });
    }
    await Balance.findOneAndUpdate(
        {
          _id: userBalance._id,
        },
        {
          inJail: false,
        }
      );
    const embed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(`🔓 ${user.tag} has been released from jail!`)
      .setFooter({
        text: "They are now free to use economy commands.",
        iconURL: client.user.displayAvatarURL(),
      });
      if(interaction.guild.iconURL()) {
        embed.setThumbnail(interaction.guild.iconURL());
      }
    await interaction.reply({
      embeds: [embed],
    });
  },
};
