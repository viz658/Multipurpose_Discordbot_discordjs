const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const currencySchema = require("../../schemas/customCurrency.js");
const Balance = require("../../schemas/balance");
const serverBank = require("../../schemas/ServerBank.js");
const cooldowns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("heist")
    .setDescription(
      "Very low chance to rob the server bank. Getting caught will result in severe punishments."
    )
    .setDMPermission(false),
  category: "economy",
  async execute(interaction, client) {
    const userId = interaction.user.id;
    if (cooldowns.has(userId)) {
      const expirationTime = cooldowns.get(userId) + 1000 * 60 * 60;
      const timeLeft = (expirationTime - Date.now()) / 1000 / 60;
      return await interaction.reply({
        content: `You are currently on cooldown for this command. Please wait ${timeLeft.toFixed(
          1
        )} more minute(s) before using it again.`,
        ephemeral: true,
      });
    }

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
    const serverbank = await client.fetchBank(interaction.guild.id);
    let currdata = await currencySchema.findOne({
      Guild: interaction.guild.id,
    });
    let currency = currdata ? currdata.Currency : "$";
    const filter = (m) => m.author.id === interaction.user.id;
    await interaction.reply({
      content:
        "Are you sure you want to do this? Getting caught will lead to severe punishments. Type `yes` to confirm or `no` to cancel.",
      ephemeral: true,
    });
    const collector = interaction.channel.createMessageCollector({
      filter,
      time: 15000,
      max: 1,
    });
    const robberemoji = "<:9098robber:1203937596170829824>";
    const handcuffsemoji = "<:8831handcuffs:1203938626300411934>";
    const jailemoji = "<:1887_Jail_pepe:1203964036874764308>";
    const rng = Math.random();
    collector.on("collect", async (m) => {
      if (m.content.toLowerCase() === "yes") {
        cooldowns.set(userId, Date.now());
        setTimeout(() => {
          cooldowns.delete(userId);
        }, 1000 * 60 * 60); // hr cooldown 1000 * 60 * 60
        await interaction.followUp({
          content: "Heist initiated",
          ephemeral: true,
        });
        if (rng <= 0.1) {
          //10% chance of success
          let heistamount = serverbank.bank * 0.9; //90% of server bank
          await client.toFixedNumber(heistamount);
          await Balance.findOneAndUpdate(
            {
              _id: userbalance._id,
            },
            {
              balance: await client.toFixedNumber(
                userbalance.balance + heistamount
              ),
            }
          );
          await serverBank.findOneAndUpdate(
            {
              guildId: interaction.guild.id,
            },
            {
              bank: await client.toFixedNumber(serverbank.bank - heistamount),
            }
          );
          const embed = new EmbedBuilder()
            .setTitle(`💰 Heist Successful! 💰`)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setColor("Green")
            .setDescription(
              `${robberemoji} You have successfully robbed the server bank and got away with ${currency} ${heistamount}!`
            )
            .setFooter({
              text: client.user.tag,
              iconURL: client.user.displayAvatarURL(),
            });
          if (interaction.guild.iconURL()) {
            embed.setThumbnail(interaction.guild.iconURL());
          }
          return await interaction.followUp({ embeds: [embed] });
        } else {
          //fine = 90% of users bank
          let fine;
          if (userbalance.bank === 0) {
            fine = userbalance.balance * 0.9;
          } else {
            fine = userbalance.bank * 0.9;
          }
          await client.toFixedNumber(fine);
          await Balance.findOneAndUpdate(
            {
              _id: userbalance._id,
            },
            {
              bank: await client.toFixedNumber(userbalance.bank - fine),
              inJail: true,
            }
          );
          await serverBank.findOneAndUpdate(
            {
              guildId: interaction.guild.id,
            },
            {
              bank: await client.toFixedNumber(serverbank.bank + fine),
            }
          );
          const embed = new EmbedBuilder()
            .setTitle(`🚓🚨 Heist Failed! 🚨🚓`)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setColor("Red")
            .setDescription(
              `👮 ${handcuffsemoji} ${robberemoji} You have been caught trying to rob the server bank and have been fined ${currency} ${fine}!\n You have been sent to jail! ${jailemoji}`
            )
            .setFooter({
              text: client.user.tag,
              iconURL: client.user.displayAvatarURL(),
            });
          if (interaction.guild.iconURL()) {
            embed.setThumbnail(interaction.guild.iconURL());
          }
          return await interaction.followUp({ embeds: [embed] });
        }
      } else if (m.content.toLowerCase() === "no") {
        return await interaction.followUp({
          content: "Heist cancelled, you decided to plan more!",
          ephemeral: true,
        });
      } else {
        return await interaction.followUp({
          content: "Invalid response! Heist cancelled!",
          ephemeral: true,
        });
      }
    });
    collector.on("end", async (collected, reason) => {
      if (reason === "time") {
        return await interaction.followUp({
          content: "You took too long to respond! Heist cancelled!",
          ephemeral: true,
        });
      }
    });
  },
};
