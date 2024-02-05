const chalk = require("chalk");
const bot = require("../../schemas/antibot.js");
const Balance = require("../../schemas/balance.js");
const Level = require("../../schemas/levelxp.js");
const currencySchema = require("../../schemas/customCurrency.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(chalk.bgGreen(`${client.user.tag} is online`));
    //anti bot system
    setInterval(async () => {
      const data = await bot.find();
      if (!data) return;
      data.forEach(async (g) => {
        const guild = client.guilds.cache.get(g.Guild);
        if (!guild) return;
        var members = await guild.members.fetch();
        await members.forEach(async (member) => {
          if (g.WhitelistedBots.includes(member.user.id)) return;
          if (member.user.bot && member.id !== client.user.id) {
            return await member
              .kick("Anti bot system is enabled in this server")
              .catch((err) => {});
          } else return;
        });
      });
    }, 10000); // 10 seconds
    //
    
    //interest rate economy system
    // Define a function to calculate the interest rate based on the user's level
    function calculateInterestRate(level) {
      // Determine the tier of the level (0 for levels 1-10, 1 for levels 11-20, etc.)
      const tier = Math.floor((level - 1) / 10);
  
      // Calculate the interest rate (5% for tier 0, 10% for tier 1, etc.)
      const interestRate = (tier + 1) * 0.05;
  
      return interestRate;
  }

    // Calculate interest for a user
    async function calculateInterest(userId, guildId) {
      // Fetch the user's balance and level
      const balance = await Balance.findOne({
        userId: userId,
        guildId: guildId,
      });
      const level = await Level.findOne({ userId: userId, guildId: guildId });

     // Check if level is not null
    if (level) {
      // Calculate the interest rate based on the user's level
      const interestRate = calculateInterestRate(level.level);

      // Calculate the interest
      const interest = await client.toFixedNumber(balance.bank * interestRate);

      // Update the user's balance
      balance.bank = await client.toFixedNumber(balance.bank + interest);
      await balance.save();
  }
    }

    // Calculate interest for all users in every guild every 24 hours
    setInterval(async () => {
      // Fetch all balances
      const balances = await Balance.find();

      // Calculate interest for each user
      for (const balance of balances) {
        await calculateInterest(balance.userId, balance.guildId);
      }
    }, 1000 * 60 * 60 * 6); //rn 6 hours // 1000 * 60 * 60 * 24, 24 hours
    //

    // serverbank interest always at 5%
    setInterval(async () => {
      const serverbankdata = await currencySchema.find();
      if (!serverbankdata) return;
      serverbankdata.forEach(async (g) => {
        const guild = client.guilds.cache.get(g.Guild);
        if (!guild) return;
        const serverbank = await client.fetchBank(guild.id);
        const interest = await client.toFixedNumber(serverbank.bank * 0.05);
        serverbank.bank = await client.toFixedNumber(serverbank.bank + interest);
        await serverbank.save();
      });
    }, 1000 * 60 * 60 * 6); //rn 6 hours // 1000 * 60 * 60 * 24, 24 hours
    //

  },
};
