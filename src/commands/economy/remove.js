const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
  } = require("discord.js");
  const Balance = require("../../schemas/balance");
  const currencySchema = require("../../schemas/customCurrency.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("remove")
      .setDescription("Remove money from a user's balance")
      .setDMPermission(false)
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("User to remove balance from")
          .setRequired(true)
      )
      .addNumberOption((option) =>
        option.setName("amount").setDescription("Amount to remove").setRequired(true)
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
          content: `You can't remove less than ${currency}1.00!`,
          ephemeral: true,
        });
      }
      if (targetUser.bot) {
        return await interaction.reply({
          content: `You can't remove ${currency} from a bot!`,
          ephemeral: true,
        });
      }
      const targetUserBalance = await client.fetchBalance(
        targetUser.id,
        interaction.guild.id
      );
      amount = await client.toFixedNumber(amount);
      if (targetUserBalance.balance < amount) {
        return await interaction.reply({
          content: `You can't remove more ${currency} than the user has!`,
          ephemeral: true,
        });
      }
      await Balance.findOneAndUpdate(
        {
          _id: targetUserBalance._id,
        },
        {
          balance: await client.toFixedNumber(targetUserBalance.balance - amount),
        }
      );
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(
          `✅Removed ${currency}${amount} from ${targetUser}'s balance successfully!`
        );
      return await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    },
  };