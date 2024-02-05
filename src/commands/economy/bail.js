const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const currencySchema = require("../../schemas/customCurrency.js");
const Balance = require("../../schemas/balance");
const serverBank = require("../../schemas/ServerBank.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bail")
    .setDescription("Pay to bail yourself or a friend out of jail.")
    .setDMPermission(false)
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to bail out.")
    ),
  category: "economy",
  async execute(interaction, client) {
    const user = interaction.options.getUser("user") || interaction.user;
    const payer = interaction.user;
    const payerbalance = await client.fetchBalance(
      payer.id,
      interaction.guild.id
    );
    const serverbank = await client.fetchBank(interaction.guild.id);
    let currdata = await currencySchema.findOne({
      Guild: interaction.guild.id,
    });
    let currency = currdata ? currdata.Currency : "$";
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
    const bailCost = userBalance.bailcost;
    if (payerbalance.balance < bailCost) {
      return await interaction.reply({
        content: `You do not have enough money to bail ${user.tag} out of jail! you need ${currency} ${bailCost} to bail them out.`,
        ephemeral: true,
      });
    }
    await Balance.findOneAndUpdate(
      {
        _id: payerbalance._id,
      },
      {
        balance: await client.toFixedNumber(payerbalance.balance - bailCost),
      }
    );
    await serverBank.findOneAndUpdate(
      {
        Guild: interaction.guild.id,
      },
      {
        bank: await client.toFixedNumber(serverbank.bank + bailCost),
      }
    );
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
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setDescription(`🔓 ${user.tag} has been released from jail!`)
      .setFooter({
        text: "They are now free to use economy commands.",
        iconURL: client.user.displayAvatarURL(),
      });
    if (interaction.guild.iconURL()) {
      embed.setThumbnail(interaction.guild.iconURL());
    }
    await interaction.reply({
      embeds: [embed],
    });
  },
};
