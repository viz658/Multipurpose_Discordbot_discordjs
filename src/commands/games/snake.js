const { SlashCommandBuilder } = require("discord.js");
const { Snake } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("snake")
    .setDescription("Play a game of snake")
    .setDMPermission(false),
  category: "games",
  async execute(interaction, client) {
    const Game = new Snake({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "Snake Game",
        overTitle: "Game Over",
        color: "#5865F2",
      },
      emojis: {
        board: "⬛",
        food: "🍎",
        up: "⬆️",
        down: "⬇️",
        left: "⬅️",
        right: "➡️",
      },
      snake: { head: "🟢", body: "🟩", tail: "🟢", over: "💀" },
      foods: ["🍎", "🍇", "🍊", "🫐", "🥕", "🥝", "🌽"],
      stopButton: "Stop",
      timeoutTime: 60000,
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    Game.startGame();
  },
};
