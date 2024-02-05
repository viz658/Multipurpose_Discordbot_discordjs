const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Balance = require("../../schemas/balance");
const currencySchema = require("../../schemas/customCurrency.js");
const cooldowns = new Map();
const serverBank = require("../../schemas/ServerBank.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("crime")
    .setDMPermission(false)
    .setDescription("Commit a crime for some more money"),
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
    if (userbalance.inJail) {
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
    const serverbank = await client.fetchBank(interaction.guild.id);
    var crimecases = [
      "🏦 You committed a bank robbery",
      "🚗 You stole a car",
      "🏠 You conducted a home burglary",
      "💍 You committed jewelry theft",
      "🛍️ You shoplifted from a store",
      "🚓 You evaded the police in a high-speed chase",
      "🔫 You participated in an illegal arms deal",
      "🏛️ You vandalized a public monument",
      "💻 You hacked into a government database",
      "💳 You engaged in credit card fraud",
      "🏹 You smuggled illegal goods",
      "🔍 You conducted industrial espionage",
      "💰 You embezzled funds from a company",
      "🔒 You broke into a safe",
      "🚁 You hijacked a helicopter",
      "🎭 You conducted art theft",
      "🔫 You participated in an organized crime racket",
      "🕵️ You committed corporate espionage",
      "💉 You engaged in illegal drug trafficking",
      "📤 You conducted a heist on a secure facility",
      "💼 You engaged in money laundering",
      "🏴‍☠️ You committed piracy",
      "🏝️ You conducted smuggling on the high seas",
      "🎭 You stole rare artifacts",
      "👑 You orchestrated a royal jewel heist",
      "🛡️ You engaged in black market arms trade",
      "📈 You manipulated the stock market",
      "🏢 You committed corporate sabotage",
      "🏰 You looted a historic landmark",
      "🏴‍☠️ You raided a treasure island",
      "🗡️ You engaged in illegal weapon trade",
      "🔍 You conducted a private investigation",
      "🔥 You committed arson",
      "📦 You stole a shipment of valuable goods",
      "🎲 You ran an underground gambling operation",
      "💉 You sold counterfeit medications",
      "🚤 You conducted a smuggling operation by sea",
      "🕵️ You engaged in industrial sabotage",
      "🕴️ You committed identity theft",
      "🚁 You conducted an aerial heist",
      "🏰 You stole from a medieval castle",
      "💼 You engaged in white-collar crime",
      "🕰️ You committed a time-traveling heist",
      "📝 You forged valuable documents",
      "🌐 You conducted cyber warfare",
      "🚢 You engaged in illegal maritime activities",
      "🌌 You stole rare celestial artifacts",
      "🚚 You hijacked a valuable cargo truck",
      "🛩️ You conducted a heist at an airport",
      "🔨 You committed grand theft auto",
    ];
    const randomcase =
      crimecases[Math.floor(Math.random() * crimecases.length)];
    const amount = Math.floor(Math.random() * 1901) + 100;
    const rng = Math.random();
    if (rng < 0.4) {
      await Balance.findOneAndUpdate(
        {
          _id: userbalance._id,
        },
        {
          balance: await client.toFixedNumber(userbalance.balance + amount),
        }
      );
      const embed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setColor("Green")
        .setDescription(`${randomcase} and made ${currency} ${amount}!`)
        .setFooter({
          text: client.user.tag,
          iconURL: client.user.displayAvatarURL(),
        });
      return await interaction.reply({
        embeds: [embed],
      });
    } else {
      const handcuffsemoji = "<:8831handcuffs:1203938626300411934>";
      const jailemoji = "<:1887_Jail_pepe:1203964036874764308>";
      const fine = Math.floor(userbalance.balance * 0.3);
      await Balance.findOneAndUpdate(
        {
          _id: userbalance._id,
        },
        {
          balance: await client.toFixedNumber(userbalance.balance - fine),
        }
      );
      await serverBank.findOneAndUpdate(
        {
          _id: serverbank._id,
        },
        {
          bank: await client.toFixedNumber(serverbank.bank + fine),
        }
      );

      const rng2 = Math.random();
      //30% chance to go to jail
      if (rng2 < 0.3) {
        await Balance.findOneAndUpdate(
          {
            _id: userbalance._id,
          },
          {
            inJail: true,
          }
        );
        const embed = new EmbedBuilder()
          .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setColor("Red")
          .setDescription(
            `${randomcase} and got ${handcuffsemoji} caught! \n You were fined ${currency} ${fine} and sent to jail! ${jailemoji}`
          )
          .setFooter({
            text: client.user.tag,
            iconURL: client.user.displayAvatarURL(),
          });
        return await interaction.reply({
          embeds: [embed],
        });
      } else {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setColor("Red")
          .setDescription(
            `${randomcase} and got ${handcuffsemoji} caught! \n You were fined ${currency} ${fine}!`
          )
          .setFooter({
            text: client.user.tag,
            iconURL: client.user.displayAvatarURL(),
          });
        return await interaction.reply({
          embeds: [embed],
        });
      }
    }
  },
};
