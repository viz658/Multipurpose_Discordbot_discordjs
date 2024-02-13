const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const leaderboardbackgroundSchema = require("../../schemas/LeaderboardBackground.js");
const Level = require("../../schemas/levelxp");
const { Font, LeaderboardBuilder } = require("canvacord");
const fetch = require("node-fetch");
const  sharp = require("sharp");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("levels-leaderboard")
    .setDescription("Shows leaderboard of levels in the server")
    .setDMPermission(false),
  category: "community",
  async execute(interaction, client) {
    await interaction.deferReply();
    const leaderboardbgdata = await leaderboardbackgroundSchema.findOne({
      guildId: interaction.guild.id,
    });
    let background = "";
    if (!leaderboardbgdata) {
      background = "src\\assets\\uqy8U9A.jpg";
    } else {
      const response = await fetch(leaderboardbgdata.leaderboardurl);
      if (!response.ok) throw new Error("Failed to download image");
      const imageBuffer = await response.buffer();
      const metadata = await sharp(imageBuffer)
        .metadata()
        .catch((err) => console.error(err));
      if (!metadata) {
        await interaction.editReply({content: "Please make sure the server's level background is a valid image URL and not a redirect URL", ephemeral: true});
        return;
      }
      background = await sharp(imageBuffer).toBuffer();
    }
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
          avatarURL: "src\\assets\\saddogoo.jpg", // replace with your default avatar URL
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
          level: top5Ranks[0] ? top5Ranks[0].level : 0,
          xp: top5Ranks[0] ? top5Ranks[0].xp : 0,
          rank: 1,
        },
        {
          avatar: `${rank2.avatarURL}`,
          username: `${rank2.username}`,
          displayName: `${rank2.username}`,
          level: top5Ranks[1] ? top5Ranks[1].level : 0,
          xp: top5Ranks[1] ? top5Ranks[1].xp : 0,
          rank: 2,
        },
        {
          avatar: `${rank3.avatarURL}`,
          username: `${rank3.username}`,
          displayName: `${rank3.username}`,
          level: top5Ranks[2] ? top5Ranks[2].level : 0,
          xp: top5Ranks[2] ? top5Ranks[2].xp : 0,
          rank: 3,
        },
        {
          avatar: `${rank4.avatarURL}`,
          username: `${rank4.username}`,
          displayName: `${rank4.username}`,
          level: top5Ranks[3] ? top5Ranks[3].level : 0,
          xp: top5Ranks[3] ? top5Ranks[3].xp : 0,
          rank: 4,
        },
        {
          avatar: `${rank5.avatarURL}`,
          username: `${rank5.username}`,
          displayName: `${rank5.username}`,
          level: top5Ranks[4] ? top5Ranks[4].level : 0,
          xp: top5Ranks[4] ? top5Ranks[4].xp : 0,
          rank: 5,
        },
      ])
      .setBackground(background);
    const image = await lb.build({ format: "png" });
    const attachment = new AttachmentBuilder(image);
    await interaction.editReply({ files: [attachment] });
  },
};
