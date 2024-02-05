const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const currencySchema = require("../../schemas/customCurrency.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverbank")
    .setDescription("Check the server bank balance.")
    .setDMPermission(false),
  category: "economy",
  async execute(interaction, client) {
    const userbalance = await client.fetchBalance(
      interaction.user.id,
      interaction.guild.id
    );
    if(userbalance.inJail) {
      return await interaction.reply({
        content: "You cannot access economy commands while in jail!",
        ephemeral: true,
      });
    }
    const serverbank = await client.fetchBank(interaction.guild.id);
    let currdata = await currencySchema.findOne({
      Guild: interaction.guild.id,
    });
    let currency = currdata ? currdata.Currency : "$";
    const embed = new EmbedBuilder()
      .setTitle(`🏦 ${interaction.guild.name}'s Bank ${currency}`)
      .setDescription(`The server bank is at ${currency} ${serverbank.bank}.`)
      .setColor("Green")
      .setFooter({
        text: "Maybe time for a /heist 👀",
        iconURL: client.user.displayAvatarURL(),
      });
      if (interaction.guild.iconURL()) {
        embed.setThumbnail(interaction.guild.iconURL());
      }
    interaction.reply({ embeds: [embed] });
  },
};
