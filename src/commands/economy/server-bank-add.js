const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const currencySchema = require("../../schemas/customCurrency.js");
const serverBank = require("../../schemas/ServerBank.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server-bank-add")
    .setDescription("Add money to the server bank.")
    .setDMPermission(false)
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount to add.")
        .setRequired(true)
    ),
  category: "economy",
  async execute(interaction, client) {
    const userbalance = await client.fetchBalance(
      interaction.user.id,
      interaction.guild.id
    );
    if (userbalance.inJail) {
      return await interaction.reply({
        content: "You cannot access economy commands while in jail!",
        ephemeral: true,
      });
    }
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("⚠️You do not have permissions to use this command.⚠️");
      return await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
    let amount = interaction.options.getNumber("amount");
    const serverbank = await client.fetchBank(interaction.guild.id);
    let currdata = await currencySchema.findOne({
        Guild: interaction.guild.id,
      });
      let currency = currdata ? currdata.Currency : "$";
      await serverBank.findOneAndUpdate(
        {
          _id: serverbank._id,
        },
        {
          bank: await client.toFixedNumber(serverbank.bank + amount),
        }
      );
      const embed = new EmbedBuilder()
      .setTitle(`🏦 ${interaction.guild.name}'s Bank ${currency}`)
      .setDescription(`${currency} ${amount} had been added to the server's bank \n New server bank balance: ${await client.toFixedNumber(serverbank.bank + amount)}.`)
      .setColor("Green")
      .setFooter({
        text: client.user.tag,
        iconURL: client.user.displayAvatarURL(),
      });
    if (interaction.guild.iconURL()) {
      embed.setThumbnail(interaction.guild.iconURL());
    }
    await interaction.reply({ embeds: [embed] });
  },
};
