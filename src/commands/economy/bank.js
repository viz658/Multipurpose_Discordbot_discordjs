const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Balance = require("../../schemas/balance");
const currencySchema = require("../../schemas/customCurrency.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bank")
    .setDescription(
      "Deposit or withdraw money from your bank account-benefit from compound interest!"
    )
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("deposit")
        .setDescription("Deposit money into your bank account")
        .addNumberOption((option) =>
          option
            .setName("amount")
            .setDescription("Amount to deposit")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("withdraw")
        .setDescription("Withdraw money from your bank account")
        .addNumberOption((option) =>
          option
            .setName("amount")
            .setDescription("Amount to withdraw")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("d-all")
        .setDescription("Deposit all your money into your bank account")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("w-all")
        .setDescription("Withdraw all your money from your bank account")
    ),
  category: "economy",
  async execute(interaction, client) {
    const userStoredBalance = await client.fetchBalance(
      interaction.user.id,
      interaction.guild.id
    );
    if(userStoredBalance.inJail) {
      return await interaction.reply({
        content: "You cannot access economy commands while in jail!",
        ephemeral: true,
      });
    }
    const currdata = await currencySchema.findOne({
      Guild: interaction.guild.id,
    });
    const currency = currdata ? currdata.Currency : "$";
    if (interaction.options.getSubcommand() === "deposit") {
      const amount = interaction.options.getNumber("amount");
      if (amount < 1)
        return await interaction.reply({
          content: `You can't deposit less than ${currency} 1.00!`,
          ephemeral: true,
        });
      if (userStoredBalance.balance < amount)
        return await interaction.reply({
          content: `You don't have enough money to deposit ${currency} ${amount}!`,
          ephemeral: true,
        });
      await Balance.findOneAndUpdate(
        {
          _id: userStoredBalance._id,
        },
        {
          balance: await client.toFixedNumber(
            userStoredBalance.balance - amount
          ),
          bank: await client.toFixedNumber(userStoredBalance.bank + amount),
        }
      );
      const embed = new EmbedBuilder()
        .setTitle("🏦Bank Deposit")
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
        .setColor("Green")
        .setFooter({
          text: client.user.tag,
          iconURL: client.user.displayAvatarURL(),
        })
        .setDescription(
          `You have deposited ${currency} ${amount} into your bank account!\n You will be rewarded with interest rate depending on your /level!`
        );
      return await interaction.reply({
        embeds: [embed],
      });
    } else if (interaction.options.getSubcommand() === "withdraw") {
      const amount = interaction.options.getNumber("amount");
      if (amount < 1)
        return await interaction.reply({
          content: `You can't withdraw less than ${currency} 1.00!`,
          ephemeral: true,
        });
      if (userStoredBalance.bank < amount)
        return await interaction.reply({
          content: `You don't have enough money to withdraw ${currency} ${amount} from your bank account!`,
          ephemeral: true,
        });
      await Balance.findOneAndUpdate(
        {
          _id: userStoredBalance._id,
        },
        {
          balance: await client.toFixedNumber(
            userStoredBalance.balance + amount
          ),
          bank: await client.toFixedNumber(userStoredBalance.bank - amount),
        }
      );
      const embed = new EmbedBuilder()
        .setTitle("🏦Bank Withdrawal")
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
        .setColor("Green")
        .setFooter({
          text: client.user.tag,
          iconURL: client.user.displayAvatarURL(),
        })
        .setDescription(
          `You have withdrawn ${currency} ${amount} from your bank account!`
        );
      return await interaction.reply({
        embeds: [embed],
      });
    } else if (interaction.options.getSubcommand() === "d-all") {
      if (userStoredBalance.balance < 1)
        return await interaction.reply({
          content: `You don't have any money to deposit!`,
          ephemeral: true,
        });
      await Balance.findOneAndUpdate(
        {
          _id: userStoredBalance._id,
        },
        {
          balance: 0,
          bank: await client.toFixedNumber(
            userStoredBalance.bank + userStoredBalance.balance
          ),
        }
      );
      const embed = new EmbedBuilder()
        .setTitle("🏦Bank Deposit")
        .setColor("Green")
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
        .setFooter({
          text: client.user.tag,
          iconURL: client.user.displayAvatarURL(),
        })
        .setDescription(
          `You have deposited ${currency} ${userStoredBalance.balance} into your bank account! \n You will be rewarded with interest rate depending on your /level!`
        );
      return await interaction.reply({
        embeds: [embed],
      });
    } else if (interaction.options.getSubcommand() === "w-all") {
      if (userStoredBalance.bank < 1)
        return await interaction.reply({
          content: `You don't have any money to withdraw!`,
          ephemeral: true,
        });
      await Balance.findOneAndUpdate(
        {
          _id: userStoredBalance._id,
        },
        {
          balance: await client.toFixedNumber(
            userStoredBalance.balance + userStoredBalance.bank
          ),
          bank: 0,
        }
      );
      const embed = new EmbedBuilder()
        .setTitle("🏦Bank Withdrawal")
        .setColor("Green")
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
        .setFooter({
          text: client.user.tag,
          iconURL: client.user.displayAvatarURL(),
        })
        .setDescription(
          `You have withdrawn ${currency} ${userStoredBalance.bank} from your bank account!`
        );
      return await interaction.reply({
        embeds: [embed],
      });
    }
  },
};
