const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Balance = require("../../schemas/balance");
const currencySchema = require("../../schemas/customCurrency.js");
const cooldowns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDMPermission(false)
    .setDescription("Work for some money"),
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
      const expirationTime = cooldowns.get(userId) + 1000 * 60 * 5;
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
    }, 1000 * 60 * 5); // 5 min cooldown
    var workcases = [
      "💻 Computer Scientist",
      "👩‍🏫 Teacher",
      "🏦 Bank Teller",
      "🎨 Graphic Designer",
      "👨‍🍳 Chef",
      "☕ Barista",
      "📰 Journalist",
      "🔧 Mechanic",
      "💾 Software Developer",
      "👩‍⚕️ Doctor",
      "🚒 Firefighter",
      "👮 Police Officer",
      "📚 Librarian",
      "🎨 Artist",
      "✈️ Pilot",
      "📸 Photographer",
      "🔧 Engineer",
      "🏛️ Architect",
      "🐾 Vet",
      "⚡ Electrician",
      "🔧 Plumber",
      "👩‍⚕️ Nurse",
      "🚀 Astronaut",
      "⚖️ Lawyer",
      "🦷 Dentist",
      "🚑 Paramedic",
      "🌦️ Meteorologist",
      "👗 Fashion Designer",
      "🎬 Film Director",
      "👩‍💼 Entrepreneur",
      "💪 Fitness Trainer",
      "📱 Social Media Manager",
      "🎮 Game Developer",
      "🎉 Event Planner",
      "🧠 Psychologist",
      "💻 Web Developer",
      "📊 Data Analyst",
      "🔬 Biologist",
      "🔍 Forensic Scientist",
      "🦓 Zoologist",
      "📜 Historian",
      "⚗️ Chemist",
      "➕ Mathematician",
      "⛏️ Archaeologist",
      "🎵 Musician",
      "🛫 Air Traffic Controller",
      "🛫 Flight Attendant",
      "🚖 Taxi Driver",
      "💰 Cryptocurrency Analyst",
      "🗺️ Tour Guide",
    ];
    const randomcase = workcases[Math.floor(Math.random() * workcases.length)];
    const rng = Math.floor(Math.random() * 301) + 200;
    await Balance.findOneAndUpdate(
      {
        _id: userbalance._id,
      },
      {
        balance: await client.toFixedNumber(userbalance.balance + rng),
      }
    );
    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setColor("Green")
      .setDescription(
        `You worked as a ${randomcase} and earned ${currency} ${rng}!`
      )
      .setFooter({
        text: client.user.tag,
        iconURL: client.user.displayAvatarURL(),
      });
    await interaction.reply({ embeds: [embed] });
  },
};
