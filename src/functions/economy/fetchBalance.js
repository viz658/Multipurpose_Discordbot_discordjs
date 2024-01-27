const Balance = require("../../schemas/balance.js");
const { Types } = require("mongoose");

module.exports = (client) => {
  client.fetchBalance = async (userId, guildId) => {
    const storedBalance = await Balance.findOne({
      userId: userId,
      guildId: guildId,
    });

    if (!storedBalance) {
      const storedBalance = await new Balance({
        _id:  new Types.ObjectId(),
        userId: userId,
        guildId: guildId,
      });

      await storedBalance
        .save()
        .then(async (balance) => {
          
        })
        .catch(console.error);
      return storedBalance;
    } else return storedBalance;
  };
};
