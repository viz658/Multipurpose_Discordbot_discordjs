const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const canvacord = require("canvacord");
const calculateLevelXp = require("../../functions/tools/levelxpcalc");
const Level = require("../../schemas/levelxp");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("levels-leaderboard")
    .setDescription("Shows leaderboard of levels in the server")
    .setDMPermission(false),
  category: "community",
  async execute(interaction, client) {
    
    
    const lb = new LeaderboardBuilder()
      .setHeader({
        title: `${interaction.guild.name}'s Leaderboard`,
        image: ``,
        subtitle: ``,
      })
      .setPlayers([
        {
          avatar: ``,
          username: ``,
          displayName: ``,
          //   level: ,
          //   xp: ,
          //   rank: ,
        },
        {
          avatar: ``,
          username: ``,
          displayName: ``,
          //   level: ,
          //   xp: ,
          //   rank: ,
        },
        {
          avatar: ``,
          username: ``,
          displayName: ``,
          //   level: ,
          //   xp: ,
          //   rank: ,
        },
        {
          avatar: ``,
          username: ``,
          displayName: ``,
          //   level: ,
          //   xp: ,
          //   rank: ,
        },
        {
          avatar: ``,
          username: ``,
          displayName: ``,
          //   level: ,
          //   xp: ,
          //   rank: ,
        },
      ])
      .setBackground("srcassetslevelslb.jpg");
    const image = await lb.build();
    const attachment = new AttachmentBuilder(image);
    await interaction.reply({ files: [attachment] });
  },
};
