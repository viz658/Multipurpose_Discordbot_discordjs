const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Balance = require("../../schemas/balance");
const currencySchema = require("../../schemas/customCurrency.js");
const cooldowns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slut")
    .setDMPermission(false)
    .setDescription("Be a slut for some extra money"),
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
    var slutcases = [
      "You gave good old succ 👅",
      "You worked as a stripper 💃",
      "You worked as a prostitute 👯‍♀️",
      "You worked as a pornstar 🌟",
      "You worked as a camgirl 📹",
      "You worked as a sensual masseuse 💆‍♀️",
      "You worked as an exotic dancer 💃",
      "You worked as a lingerie model 🩲",
      "You worked as a burlesque performer 🎭",
      "You worked as a dominatrix 👠",
      "You worked as a sugar baby 🍬",
      "You worked as a phone sex operator 📞",
      "You worked as a pole dancer 🕺",
      "You worked as a burlesque dancer 💃",
      "You worked as a fetish model 👢",
      "You worked as a nude art model 🎨",
      "You worked as an adult film director 🎬",
      "You worked as an adult toy tester 🍆",
      "You worked as a boudoir photographer 📸",
      "You worked as a romantic novelist 📖",
      "You worked as a bikini model 👙",
      "You worked as a swimsuit designer 🩱",
      "You worked as a strip club DJ 🎧",
      "You worked as a lingerie store clerk 👚",
      "You worked as a body double for movies 🎥",
      "You worked as a hostess at a nightclub 🍸",
      "You worked as a lingerie fashion show model 👙",
      "You worked as a fantasy roleplay performer 🧚‍♀️",
      "You worked as a live streamer with a twist 🎮",
      "You worked as a private dance instructor 🕺",
      "You worked as a burlesque choreographer 💃",
      "You worked as a lingerie designer 👙",
      "You worked as an adult event planner 🎉",
      "You worked as an intimate apparel consultant 👄",
      "You worked as a love advice columnist 💖",
      "You worked as a sensual massage therapist 💆‍♂️",
      "You worked as a romantic getaway planner 🌴",
      "You worked as a body paint artist 🎨",
    ];
    const randomcase = slutcases[Math.floor(Math.random() * slutcases.length)];
    // rng random number from 300-800
    const rng = Math.floor(Math.random() * 501) + 300;
    await Balance.findOneAndUpdate(
      {
        _id: userbalance._id,
      },
      {
        balance: await client.toFixedNumber(userbalance.balance + rng),
      }
    );
    const emoji = "<:1784_lip_bite:1204179911481360465>";
    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setColor("Green")
      .setDescription(`${emoji} ${randomcase} and earned ${currency} ${rng}!`)
      .setFooter({
        text: client.user.tag,
        iconURL: client.user.displayAvatarURL(),
      });
    await interaction.reply({ embeds: [embed] });
  },
};
