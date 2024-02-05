const { SlashCommandBuilder } = require("discord.js");
const { Slots } = require("discord-gamecord");
const currencySchema = require("../../schemas/customCurrency.js");
const Balance = require("../../schemas/balance");
const serverBank = require("../../schemas/ServerBank.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slots")
    .setDescription("Play a game of slots to win economy money.")
    .addIntegerOption((option) =>
      option
        .setName("bet")
        .setDescription("Amount of money to bet")
        .setRequired(true)
    )
    .setDMPermission(false),
  category: "games",
  async execute(interaction, client) {
    const bet = interaction.options.getInteger("bet");
    const userbalance = await client.fetchBalance(
      interaction.user.id,
      interaction.guild.id
    );
    const serverbank = await client.fetchBank(interaction.guild.id);
    let currdata = await currencySchema.findOne({
      Guild: interaction.guild.id,
    });
    let currency = currdata ? currdata.Currency : "$";
    if (bet < 1) {
      return interaction.reply({
        content: `You can't bet less than ${currency} 1.`,
        ephemeral: true,
      });
    }
    if (bet > userbalance.balance) {
      return interaction.reply({
        content: `You don't have enough ${currency} in your wallet to bet that amount.`,
        ephemeral: true,
      });
    }

    const Game = new Slots({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "Slot Machine",
        color: "#5865F2",
      },
      slots: ["🍇", "🍊", "🍋", "🍌"],
    });

    Game.startGame();
    Game.on("gameOver", async (result) => {
      //if result is lose
      if (result.result === "lose") {
        await Balance.findOneAndUpdate(
          {
            _id: userbalance._id,
          },
          {
            balance: await client.toFixedNumber(userbalance.balance - bet),
          }
        );
        await serverBank.findOneAndUpdate(
          {
            _id: serverbank._id,
          },
          {
            bank: await client.toFixedNumber(serverbank.bank + bet),
          }
        );

        return interaction.followUp(`You ${result.result} ${currency} ${bet}.`);
      } else {
        await Balance.findOneAndUpdate(
          {
            _id: userbalance._id,
          },
          {
            balance: await client.toFixedNumber(userbalance.balance + bet),
          }
        );
        return interaction.followUp(
          `You ${
            result.result
          } ${currency} ${bet}. Your slots were ${result.slots.join(", ")}.`
        );
      }
    });
  },
};
