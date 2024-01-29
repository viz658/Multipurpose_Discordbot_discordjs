const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const calculateLevelXp = require("../../functions/tools/levelxpcalc");
const Level = require("../../schemas/levelxp");
const { Font, LeaderboardBuilder } = require("canvacord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("levels-leaderboard")
    .setDescription("Shows leaderboard of levels in the server")
    .setDMPermission(false),
  category: "community",
  async execute(interaction, client) {
    let allLevels = await Level.find({ guildId: interaction.guild.id }).select(
      "-_id userId level xp"
    );

    allLevels.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp;
      } else {
        return b.level - a.level;
      }
    });
    let top5Ranks = allLevels.slice(0, 5).map((lvl, index) => ({
      rank: index + 1,
      userId: lvl.userId,
      level: lvl.level,
      xp: lvl.xp,
    }));
    const fetchUserAndAvatar = async (rank) => {
      if (rank) {
        const user = await interaction.client.users.fetch(rank.userId);
        return {
          avatarURL: user.displayAvatarURL(),
          username: user.username,
        };
      } else {
        return {
          avatarURL: "src\\assets\\defaultlbuser.webp", // replace with your default avatar URL
          username: "More users need to engage",
        };
      }
    };

    const rank1 = await fetchUserAndAvatar(top5Ranks[0]);
    const rank2 = await fetchUserAndAvatar(top5Ranks[1]);
    const rank3 = await fetchUserAndAvatar(top5Ranks[2]);
    const rank4 = await fetchUserAndAvatar(top5Ranks[3]);
    const rank5 = await fetchUserAndAvatar(top5Ranks[4]);

    Font.loadDefault();
    const lb = new LeaderboardBuilder()
      .setHeader({
        title: `${interaction.guild.name}'s Leaderboard`,
        image: `${
          interaction.guild.iconURL()
            ? interaction.guild.iconURL()
            : "src\\assets\\lbtemp.jpg"
        }`,
        subtitle: `${interaction.guild.memberCount} members`,
      })
      .setPlayers([
        {
          avatar: `${rank1.avatarURL}`,
          username: `${rank1.username}`,
          displayName: `${rank1.username}`,
          level: rank1.level,
          xp: rank1.xp,
          rank: 1,
        },
        {
          avatar: `${rank2.avatarURL}`,
          username: `${rank2.username}`,
          displayName: `${rank2.username}`,
          level: rank2.level,
          xp: rank2.xp,
          rank: 2,
        },
        {
          avatar: `${rank3.avatarURL}`,
          username: `${rank3.username}`,
          displayName: `${rank3.username}`,
          level: rank3.level,
          xp: rank3.xp,
          rank: 3,
        },
        {
          avatar: `${rank4.avatarURL}`,
          username: `${rank4.username}`,
          displayName: `${rank4.username}`,
          level: rank4.level,
          xp: rank4.xp,
          rank: 4,
        },
        {
          avatar: `${rank5.avatarURL}`,
          username: `${rank5.username}`,
          displayName: `${rank5.username}`,
          level: rank5.level,
          xp: rank5.xp,
          rank: 5,
        },
      ])
      .setBackground("src\\assets\\levelslb.jpg");
    const image = await lb.build({ format: "png" });
    const attachment = new AttachmentBuilder(image);
    await interaction.reply({ files: [attachment] });
  },
};
