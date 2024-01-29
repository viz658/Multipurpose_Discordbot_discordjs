const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Balance = require("../../schemas/balance");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Claim your daily 💸")
    .setDMPermission(false),
  category: "economy",
  async execute(interaction, client) {
    let daily = Math.floor(Math.random() * (1000 - 150 + 1) + 150);
    const userStoredBalance = await client.fetchBalance(
      interaction.user.id,
      interaction.guild.id
    );
    let data = await Balance.findOne({
      userId: interaction.user.id,
      guildId: interaction.guild.id,
    });
    if (!data) {
      // Handle the case where the user doesn't have a balance
      data = await new Balance({
        userId: interaction.user.id,
        guildId: interaction.guild.id,
        balance: daily,
        lastDaily: new Date(new Date().setDate(new Date().getDate() - 1)),
      }).save();
    } else if (data) {
      if (!data.lastDaily)
        data.lastDaily = new Date(new Date().setDate(new Date().getDate() - 1));
      const lastDailyDate = data.lastDaily.toDateString();
      const currentDate = new Date().toDateString();
      if (lastDailyDate === currentDate) {
        const embed = new EmbedBuilder()
          .setDescription(
            `⚠️You have already claimed your daily 💸 Please wait until tomorrow.⚠️`
          )
          .setColor("Red");
        return await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      } else {
        await Balance.findOneAndUpdate(
          {
            _id: userStoredBalance._id,
          },
          {
            balance: await client.toFixedNumber(
              userStoredBalance.balance + daily
            ),
            lastDaily: new Date(),
          }
        );
        const embed = new EmbedBuilder()
          .setTitle(`You have claimed your daily 💸 of $${daily}`)
          .setDescription(
            `Your new balance is $${await client.toFixedNumber(
              userStoredBalance.balance + daily
            )}`
          )
          .setColor("Green");
        await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }
    }
  },
};
