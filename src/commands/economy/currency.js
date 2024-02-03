const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const currencySchema = require("../../schemas/customCurrency.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("currency")
    .setDescription("Set the currency for your server, default: $")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("symbol")
        .setDescription("Can be emoji or text. Example: $, €, £, 💰, etc.")
        .setMaxLength(15)
        .setRequired(true)
    ),
  category: "economy",
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return await interaction.reply({
        content: "You don't have permission to use this command.",
        ephemeral: true,
      });
    }
    const symbol = interaction.options.getString("symbol");
    if (symbol.length > 15) {
      return await interaction.reply({
        content: "The currency symbol must be 15 characters or less.",
        ephemeral: true,
      });
    }
    await currencySchema.findOneAndUpdate(
      {
        Guild: interaction.guild.id,
      },
      {
        Guild: interaction.guild.id,
        Currency: symbol,
      },
      {
        upsert: true,
      }
    );
    const embed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(
        `✅ The currency for ${interaction.guild.name} has been set to: ${symbol}`
      );
    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
