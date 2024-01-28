const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lfg")
    .setDMPermission(false)
    .setDescription(
      "Look for a group to play -returns list of players playing the game you want to play"
    )
    .addStringOption((option) =>
      option
        .setName("game")
        .setDescription("The game you want to play")
        .setRequired(true)
    ),
  category: "community",
  async execute(interaction) {
    const game = interaction.options.getString("game");
    let members = await interaction.guild.members.fetch();

    let lfg = [];
    members.forEach((member) => {
      if (!member.presence || !member.presence.activities[0]) return;

      let currentGame = member.presence.activities[0].name;

      if (currentGame.toLowerCase() === game.toLowerCase()) {
        lfg.push({ member: member.id, game: currentGame });
      }
    });

    let desc = "";
    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle(
        `🎮 Server members playing **${
          game.charAt(0).toUpperCase() + game.slice(1)
        }** 🕹️`
      );
    lfg.forEach((lfg) => {
      let member = interaction.guild.members.cache.get(lfg.member);
      desc += `Member: ${member.user} is playing **${lfg.game}**\n`;
    });

    if (desc) {
      desc = desc.replace(/undefined/g, "");
      embed.setDescription(desc);
    } else {
      embed.setDescription(`No members playing **${game}**`);
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
