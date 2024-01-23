const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Balance = require("../../schemas/balance");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pay")
    .setDescription("Pay a user amnount amount of money")
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
    const targetUser = interaction.options.getUser("user");
    let amount = interaction.options.getNumber("amount");
    const userStoredBalance = await client.fetchBalance(
      interaction.user.id,
      interaction.guild.id
    );
    if (targetUser.bot || targetUser.id == interaction.user.id)
      return await interaction.reply({
        content: "You can't pay a bot or yourself!",
        ephemeral: true,
      });
    else if (amount < 1.0)
      return await interaction.reply({
        content: "You can't pay less than $1.00!",
        ephemeral: true,
      });
    else if (amount > userStoredBalance.balance)
      return await interaction.reply({
        content: "You don't have enough money to pay that amount!",
        ephemeral: true,
      });
    const targetUserBalance = await client.fetchBalance(
      targetUser.id,
      interaction.guild.id
    );

    amount = await client.toFixedNumber(amount);

    await Balance.findOneAndUpdate(
      {
        _id: userStoredBalance._id,
      },
      {
        balance: await client.toFixedNumber(userStoredBalance.balance - amount),
      }
    );
    await Balance.findOneAndUpdate(
      {
        _id: targetUserBalance._id,
      },
      {
        balance: await client.toFixedNumber(targetUserBalance.balance + amount),
      }
    );


    const embed = new EmbedBuilder()
      .setTitle(`${interaction.user.tag} paid ${targetUser.tag} $${amount}`)
      .setColor("Blurple")
      .addFields({
        name: `${interaction.user.tag}'s Balance`,
        value: `$${await client.toFixedNumber(
          userStoredBalance.balance - amount
        )}`,
      })
      .addFields({
        name: `${targetUser.tag}'s Balance`,
        value: `$${await client.toFixedNumber(
          targetUserBalance.balance + amount
        )}`,
      })
      .setTimestamp()
      .setFooter({
        text: client.user.tag,
        iconURL: client.user.displayAvatarURL(),
      });

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
  },
};
