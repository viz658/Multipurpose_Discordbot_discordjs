const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const currencySchema = require("../../schemas/customCurrency.js");
const serverBank = require("../../schemas/ServerBank.js");
const Balance = require("../../schemas/balance");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tax")
    .setDescription("Collect 5% of top 10 users bank to fund the server bank")
    .setDMPermission(false),
  category: "economy",
  async execute(interaction, client) {
    
    const serverbank = await client.fetchBank(interaction.guild.id);
    if (interaction.user.id !== interaction.guild.ownerId) {
        const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("⚠️Only the server owner can use this command!⚠️");
      return await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
    let currdata = await currencySchema.findOne({
      Guild: interaction.guild.id,
    });
    let currency = currdata ? currdata.Currency : "$";
    const filter = (m) => m.author.id === interaction.user.id;
    await interaction.reply({
      content:
        "Are you sure you want to collect taxes on the top 10 users? This action is irreversible! Type `yes` to confirm or `no` to cancel.",
      ephemeral: true,
    });
    const collector = interaction.channel.createMessageCollector({
      filter,
      time: 15000,
      max: 1,
    });
    collector.on("collect", async (m) => {
      if (m.content.toLowerCase() === "yes") {
        var members = await interaction.guild.members.fetch();
        var guildBalances = await Promise.all(
          members.map(async (member) => {
            const user = await client.fetchBalance(
              member.id,
              interaction.guild.id
            );
            return { user: member.user.id, balance: user.bank };
          })
        );
        guildBalances.sort((a, b) => b.balance - a.balance);
        var output = guildBalances.slice(0, 10);
        let totalTaxCollected = 0;
        for (const value of output) {
          var member = await interaction.guild.members.fetch(value.user);
          var tax = value.balance * 0.05;
          totalTaxCollected += tax;
          await Balance.findOneAndUpdate(
            {
              userId: member.id,
              guildId: interaction.guild.id,
            },
            {
              bank: await client.toFixedNumber(value.balance - tax),
            }
          );
          
        }
        await serverBank.findOneAndUpdate(
            {
              _id: serverbank._id,
            },
            {
              bank: await client.toFixedNumber(serverbank.bank + totalTaxCollected),
            }
          );
        const embed = new EmbedBuilder()
          .setTitle(`🏦 ${interaction.guild.name}'s Bank ${currency}`)
          .setDescription(
            `✅ Taxes have been collected and sent to the server bank successfully!`
          )
          .setColor("Green")
          .setFooter({
            text: client.user.tag,
            iconURL: client.user.displayAvatarURL(),
          });
        await interaction.followUp({
          embeds: [embed],
        });
      } else if (m.content.toLowerCase() === "no") {
        await interaction.followUp({
          content: "The tax collection has been cancelled!",
          ephemeral: true,
        });
      } else {
        await interaction.followUp({
          content: "Invalid response! The tax collection has been cancelled!",
          ephemeral: true,
        });
      }
    });
  },
};
