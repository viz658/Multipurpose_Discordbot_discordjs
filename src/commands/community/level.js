const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
// const canvacord = require("canvacord");
const calculateLevelXp = require("../../functions/tools/levelxpcalc");
const Level = require("../../schemas/levelxp");
const { Font, RankCardBuilder } = require("canvacord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Shows your level card")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user's level card you want to see")
    ),
  category: "community",
  async execute(interaction) {
    const mentionedUserId = interaction.options.get("user")?.value;
    const targetUserId = mentionedUserId || interaction.member.id;
    const targetUserObj = await interaction.guild.members.fetch(targetUserId);
   
    //check if targetuser status is offline
    if (!targetUserObj.presence) {
      return await interaction.reply({
        content: `${
          mentionedUserId
            ? `Unable to view level, ${targetUserObj.user.tag} is currently offline.`
            : "Unable to view level, you are currently offline."
        }`,
        ephemeral: true,
      });
    }
    const fetchedLevel = await Level.findOne({
      userId: targetUserId,
      guildId: interaction.guild.id,
    });

    if (!fetchedLevel) {
      return await interaction.reply({
        content: `${
          mentionedUserId
            ? `${targetUserObj.user.tag} doesn't have any levels yet. Try again when they chat a little more.`
            : "You don't have any levels yet. Chat a little more and try again."
        }`,
        ephemeral: true,
      });
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

    let currentRank =
      allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;
    Font.loadDefault();

    const rank = new RankCardBuilder()
      .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256 }))
      .setRank(currentRank)
      .setLevel(fetchedLevel.level)
      .setCurrentXP(fetchedLevel.xp)
      .setRequiredXP(calculateLevelXp(fetchedLevel.level))
      .setStatus(targetUserObj.presence.status)
      .setUsername(targetUserObj.user.username)
      .setOverlay(50)
      .setBackground("src\\assets\\level.png");
      
    const data = await rank.build({ format: "png" });
    const attachment = new AttachmentBuilder(data);
    await interaction.reply({ files: [attachment] });
  },
};
