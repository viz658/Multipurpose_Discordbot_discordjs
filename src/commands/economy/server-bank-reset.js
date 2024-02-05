const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const currencySchema = require("../../schemas/customCurrency.js");
const serverBank = require("../../schemas/ServerBank.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server-bank-reset")
    .setDescription("Reset the server bank to default balance.")
    .setDMPermission(false),
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
        .setDescription("⚠️You can not pardon a jailed user.⚠️");
      return await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
    const serverbank = await client.fetchBank(interaction.guild.id);
    if (serverbank.bank === 10000) {
      return await interaction.reply({
        content: "The server bank is already at the default balance!",
        ephemeral: true,
      });
    }
    //10000
    let currdata = await currencySchema.findOne({
      Guild: interaction.guild.id,
    });
    let currency = currdata ? currdata.Currency : "$";
    await serverBank.findOneAndUpdate(
      {
        _id: serverbank._id,
      },
      {
        bank: 10000,
      }
    );
    const embed = new EmbedBuilder()
      .setTitle(`🏦 ${interaction.guild.name}'s Bank ${currency}`)
      .setDescription(`The server bank has been reset to ${currency} 10000.`)
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
