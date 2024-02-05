const Balance = require("../../schemas/balance.js");

module.exports = (client) => {
  client.resetEconomy = async (guildId) => {
    try {
      var members = await client.guilds.cache.get(guildId).members.fetch();
      var memberIds = members.map((member) => member.id);
      try {
        await Balance.updateMany(
          { userId: { $in: memberIds }, guildId: guildId },
          { balance: 0, bank: 0 }
        );
      } catch (updateError) {
        console.error(
          `There was an error updating the balances: ${updateError}`
        );
      }
    } catch (fetchError) {
      console.error(`There was an error fetching the members: ${fetchError}`);
    }
  };
};
