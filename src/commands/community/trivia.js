const { SlashCommandBuilder } = require("discord.js");
const { Trivia } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("trivia")
    .setDescription("Play a game of trivia")
    .addStringOption((option) =>
      option
        .setName("difficulty")
        .setDescription("The difficulty of the questions, easy, medium or hard")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("mode")
        .setDescription(
          "single choice or multiple choice; choose single or multiple"
        )
        .setRequired(true)
    ),
  category: "games",
  async execute(interaction, client) {
    const { options } = interaction;
    const difficulty = options.getString("difficulty").toLowerCase();
    const mode = options.getString("mode").toLowerCase();
    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return interaction.reply({
        content:
          'Invalid difficulty. Please choose either "easy", "medium", or "hard".',
        ephemeral: true,
      });
    }

    if (!["single", "multiple"].includes(mode)) {
      return interaction.reply({
        content: 'Invalid mode. Please choose either "single" or "multiple".',
        ephemeral: true,
      });
    }

    const Game = new Trivia({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "Trivia",
        color: "#5865F2",
        description: "You have 60 seconds to guess the answer.",
      },
      timeoutTime: 60000,
      buttonStyle: "PRIMARY",
      trueButtonStyle: "SUCCESS",
      falseButtonStyle: "DANGER",
      mode: mode, // multiple || single
      difficulty: difficulty, // easy || medium || hard
      winMessage: "You won! The correct answer is {answer}.",
      loseMessage: "You lost! The correct answer is {answer}.",
      errMessage: "Unable to fetch question data! Please try again.",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    Game.startGame();
  },
};
