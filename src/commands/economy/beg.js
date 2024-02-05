const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Balance = require("../../schemas/balance");
const currencySchema = require("../../schemas/customCurrency.js");
const cooldowns = new Map();

module.exports = { 
    data: new SlashCommandBuilder()
        .setName('beg')
        .setDescription('Beg for money')
        .setDMPermission(false),
    category: "economy",
    async execute(interaction, client) { 
        const userbalance = await client.fetchBalance(
            interaction.user.id,
            interaction.guild.id
          );
          let currdata = await currencySchema.findOne({
            Guild: interaction.guild.id,
          });
          let currency = currdata ? currdata.Currency : "$";
          if(userbalance.inJail) {
            return await interaction.reply({
              content: "You cannot access economy commands while in jail!",
              ephemeral: true,
            });
          }
          const userId = interaction.user.id;
          if (cooldowns.has(userId)) {
            const expirationTime = cooldowns.get(userId) + 1000 * 60 * 15;
            const timeLeft = (expirationTime - Date.now()) / 1000 / 60;
            return await interaction.reply({
              content: `You are currently on cooldown for this command. Please wait ${timeLeft.toFixed(
                1
              )} more minute(s) before using it again.`,
              ephemeral: true,
            });
          }
          cooldowns.set(userId, Date.now());
          setTimeout(() => {
            cooldowns.delete(userId);
          }, 1000 * 60 * 15); // 15 min cooldown 
          const rng = Math.random();
          const begemoji = "<:1836pepebegging:1204139452885368832>"
          //40% chance 
          if(rng < 0.4) {
            let amount = Math.floor(Math.random() * 600) + 100;
            await Balance.findOneAndUpdate(
                {
                  _id: userbalance._id,
                },
                {
                  balance: await client.toFixedNumber(userbalance.balance + amount),
                }
              );
              const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setColor("Green")
            .setDescription(`${begemoji} You begged and got ${currency} ${amount}!`)
            .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
            return await interaction.reply({
              embeds: [embed],
            });
          } else {
            const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setColor("Red")
            .setDescription(`${begemoji} You didn't get any ${currency} this time try again later!`)
            .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
            return await interaction.reply({
              embeds: [embed],
            });
          }
    }
}