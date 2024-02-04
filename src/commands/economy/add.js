const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const Balance = require("../../schemas/balance");
const currencySchema = require("../../schemas/customCurrency.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Add money to a user's balance")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User to get balance of")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option.setName("amount").setDescription("Amount to pay").setRequired(true)
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
    let currdata = await currencySchema.findOne({
      Guild: interaction.guild.id,
    });
    let currency = currdata ? currdata.Currency : "$";

    const targetUser = interaction.options.getUser("user");
    let amount = interaction.options.getNumber("amount");
    //if amount is 0
    if (amount < 1.0) {
      return await interaction.reply({
        content: `You can't add less than ${currency} 1.00!`,
        ephemeral: true,
      });
    }
    if (targetUser.bot) {
      return await interaction.reply({
        content: `You can't add ${currency} to a bot!`,
        ephemeral: true,
      });
    }
    const targetUserBalance = await client.fetchBalance(
      targetUser.id,
      interaction.guild.id
    );
    amount = await client.toFixedNumber(amount);
    await Balance.findOneAndUpdate(
      {
        _id: targetUserBalance._id,
      },
      {
        balance: await client.toFixedNumber(targetUserBalance.balance + amount),
      }
    );
    const embed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(
        `✅Added ${currency} ${amount} to ${targetUser}'s balance successfully!`
      );
    return await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
