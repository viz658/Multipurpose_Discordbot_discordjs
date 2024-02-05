const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const currencySchema = require("../../schemas/customCurrency.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("baltop")
    .setDescription("Show balance leaderboard")
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
    var members = await interaction.guild.members.fetch();
    var guildBalances = await Promise.all(
      members.map(async (member) => {
        const user = await client.fetchBalance(member.id, interaction.guild.id);
        return { user: member.user.id, balance: user.balance };
      })
    );
    let currdata = await currencySchema.findOne({
        Guild: interaction.guild.id,
    });
    let currency = currdata ? currdata.Currency : "$";
    
    guildBalances.sort((a, b) => b.balance - a.balance);
    var output = guildBalances.slice(0, 10);
    var string = "";
    var num = 1;
    for (const value of output) {
      var member = await interaction.guild.members.fetch(value.user);
      string += `#${num} Member: ${member.user} balance: ${currency}\`${value.balance}\`\n`;
      num++;
    }

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(
        `💰 **${interaction.guild.name} Balance Leaderboard** ${currency} \n\n${string}`
      )
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    await interaction.reply({ embeds: [embed] });
  },
};
