const { SlashCommandBuilder } = require("discord.js");
const { Hangman } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hangman")
    .setDescription("Play a game of hangman")
    .setDMPermission(false),
  category: "games",
  async execute(interaction, client) {
    const theme = [ 'nature', 'sport', 'color', 'camp', 'fruit', 'discord', 'winter', 'pokemon']
    const randomtheme = theme[Math.floor(Math.random() * theme.length)];
    const Game = new Hangman({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: 'Hangman',
          color: '#5865F2'
        },
        hangman: { hat: '🎩', head: '😟', shirt: '👕', pants: '🩳', boots: '👞👞' },
        timeoutTime: 60000,
        theme: randomtheme,
        winMessage: 'You won! The word was **{word}**.',
        loseMessage: 'You lost! The word was **{word}**.',
        playerOnlyMessage: 'Only {player} can use these buttons.'
      });

    Game.startGame();
  },
};
