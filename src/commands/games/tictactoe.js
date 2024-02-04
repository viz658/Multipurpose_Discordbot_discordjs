const { SlashCommandBuilder } = require("discord.js");
const { TicTacToe } = require("discord-gamecord");
const currencySchema = require("../../schemas/customCurrency.js");
const Balance = require("../../schemas/balance");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tictactoe")
    .setDescription("Play a game of tic tac toe")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("opponent")
        .setDescription("The user to play against")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("bet")
        .setDescription("Amount of money to bet")
        .setRequired(false)
    ),
  category: "games",

  async execute(interaction, client) {
    const { options } = interaction;
    const opponent = options.getUser("opponent");
    const bet = options.getInteger("bet");
    //check that opponent is not the user or bot
    if (opponent.bot || opponent.id == interaction.user.id) {
      return await interaction.reply({
        content: "You can't play against a bot or yourself!",
        ephemeral: true,
      });
    }
    const userbalance = await client.fetchBalance(
      interaction.user.id,
      interaction.guild.id
    );
    const opponentbalance = await client.fetchBalance(
      opponent.id,
      interaction.guild.id
    );
    let currdata = await currencySchema.findOne({
      Guild: interaction.guild.id,
    });
    let currency = currdata ? currdata.Currency : "$";
    if (bet < 1 && bet !== null) {
      return interaction.reply({
        content: `You can't bet less than ${currency} 1.`,
        ephemeral: true,
      });
    }
    if (bet > userbalance.balance || bet > opponentbalance.balance) {
      return interaction.reply({
        content:
          "You or the opponent don't have enough money to bet that amount.",
        ephemeral: true,
      });
    }

    const Game = new TicTacToe({
      message: interaction,
      isSlashGame: true,
      opponent: opponent,
      embed: {
        title: "Tic Tac Toe",
        color: "#5865F2",
        statusTitle: "Status",
        overTitle: "Game Over",
      },
      emojis: {
        xButton: "❌",
        oButton: "🔵",
        blankButton: "➖",
      },
      mentionUser: true,
      timeoutTime: 60000,
      xButtonStyle: "DANGER",
      oButtonStyle: "PRIMARY",
      turnMessage: "{emoji} | Its turn of player **{player}**.",
      winMessage: "{emoji} | **{player}** won the TicTacToe Game.",
      tieMessage: "The Game tied! No one won the Game!",
      timeoutMessage: "The Game went unfinished! No one won the Game!",
      playerOnlyMessage: "Only {player} and {opponent} can use these buttons.",
      requestMessage: `Hey {opponent}, {player} challenged you for a game of **Tic Tac Toe** ${bet === null ? "" : `for ${currency} ${bet}`}!`,
    });

    Game.startGame();
    Game.on("gameOver", async (result) => {
      if (result.result === "tie") {
        return interaction.followUp({ content: "The game ended in a tie!" });
      }
      if (result.result === "win") {
        if (bet) {
          await Balance.findOneAndUpdate(
            {
              _id: userbalance._id,
            },
            {
              balance: await client.toFixedNumber(userbalance.balance + bet),
            }
          );
          await Balance.findOneAndUpdate(
            {
              _id: opponentbalance._id,
            },
            {
              balance: await client.toFixedNumber(
                opponentbalance.balance - bet
              ),
            }
          );
          return interaction.followUp({
            content: `${interaction.user} won ${currency} ${bet} against ${opponent}!`,
          });
        }
        return interaction.followUp({ content: `${interaction.user} won!` });
      } else if (result.result === "lose") {
        if (bet) {
          await Balance.findOneAndUpdate(
            {
              _id: userbalance._id,
            },
            {
              balance: await client.toFixedNumber(userbalance.balance - bet),
            }
          );
          await Balance.findOneAndUpdate(
            {
              _id: opponentbalance._id,
            },
            {
              balance: await client.toFixedNumber(
                opponentbalance.balance + bet
              ),
            }
          );
          return interaction.followUp({
            content: `${opponent} won ${currency} ${bet} against ${interaction.user}!`,
          });
        }
        return interaction.followUp({ content: `${opponent} won!` });
      }
    });
  },
};
