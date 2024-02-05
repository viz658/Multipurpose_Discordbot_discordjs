const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const currencySchema = require("../../schemas/customCurrency.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bal")
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
      let total = await client.toFixedNumber(storedBalance.balance + storedBalance.bank);
      const embed = new EmbedBuilder()
        .setTitle(`💳 ${target.tag}'s economy info`) 
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
        .setColor("Green")
        .setTimestamp()
        .setAuthor({ name: `${target.tag}`, iconURL: `${target.displayAvatarURL()}`,})
        .addFields({
          name: `Wallet`,
          value: `${currency} ${storedBalance.balance}`,
        })
        .addFields({
          name: `Bank`,
          value: `${currency} ${storedBalance.bank}`,
        })
        .addFields({
          name: `Total`,
          value: `${currency} ${total}`,
        })
        .setFooter({
          text: client.user.tag,
          iconURL: client.user.displayAvatarURL(),
        });
        //if guild has icon set thumbnail to guild icon
      if (interaction.guild.iconURL()) {
        embed.setThumbnail(interaction.guild.iconURL());
      }
      
      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
  },
};
