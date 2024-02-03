const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const currencySchema = require("../../schemas/customCurrency.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Return balance of user")
    .setDMPermission(false)
    .addUserOption((option) =>
      option.setName("user").setDescription("User to get balance of")
    ),
  category: "economy",
  async execute(interaction, client) {
    const target = interaction.options.getUser("user") || interaction.user;
    const storedBalance = await client.getBalance(
      target.id,
      interaction.guild.id
    );
    let currdata = await currencySchema.findOne({
      Guild: interaction.guild.id,
    });
    let currency = currdata ? currdata.Currency : "$";

    if (!storedBalance) {
      return await interaction.reply({
        content: `No balance found for ${target.tag}!`,
        ephemeral: true,
      });
    } else {
      const embed = new EmbedBuilder()
        .setTitle(`${target.tag}'s Balance`)
        .setTimestamp()
        .addFields({
          name: `${currency}${storedBalance.balance}`,
          value: `\u200b`,
        })
        .setFooter({
          text: client.user.tag,
          iconURL: client.user.displayAvatarURL(),
        });

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
  },
};
