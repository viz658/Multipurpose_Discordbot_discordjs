const Balance = require("../../schemas/balance.js");

module.exports = (client) => {
  client.getBalance = async (userId, guildId) => {
    const storedBalance = await Balance.findOne({
      userId: userId,
      guildId: guildId,
    });

    if (!storedBalance) {
        
    } else return storedBalance;
  };
};
