const { Types } = require("mongoose");
const ServerBank = require("../../schemas/ServerBank.js");

module.exports = (client) => {
    client.fetchBank = async (guildId) => {
        const storedBank = await ServerBank.findOne({
            guildId: guildId,
        });

        if (!storedBank) {
            const newBank = new ServerBank({
                _id: new Types.ObjectId(),
                guildId: guildId,
            });

            await newBank
                .save()
                .then(async (bank) => {
                    return bank;
                })
                .catch(console.error);
            return newBank;
        } else return storedBank;
    }
}