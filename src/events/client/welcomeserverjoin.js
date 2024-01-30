const welcomeChannelSchema = require("../../schemas/WelcomeChannel.js");
const { Font } = require("canvacord");
const { GreetingsCard } = require("../../functions/tools/GreetingsCard.jsx");
const { AttachmentBuilder } = require("discord.js");
/**
 * @param {import('discord.js').GuildMember} guildMember
 */

module.exports = {
  name: "guildMemberAdd",
  async execute(guildMember) {
    try {
      if (guildMember.user.bot) return;

      const welcomeConfigs = await welcomeChannelSchema.find({
        guildId: guildMember.guild.id,
      });

      if (!welcomeConfigs.length) return;
      for (const welcomeConfig of welcomeConfigs) {
        const targetChannel =
          guildMember.guild.channels.cache.get(welcomeConfig.channelId) ||
          (await guildMember.guild.channels.fetch(welcomeConfig.channelId));

        if (!targetChannel) {
          welcomeChannelSchema
            .findOneAndDelete({
              guildId: guildMember.guild.id,
              channelId: welcomeConfig.channelId,
            })
            .catch(() => {});

          return;
        }
        const customimageURL =
          welcomeConfig.customimageURL || "src\\assets\\uqy8U9A.jpg";
        const customimageDescription =
          welcomeConfig.imageDescription ||
          "Welcome {user} to {server}!";
        const imageDescription = customimageDescription
          .replace("{user}", guildMember.user.username)
          .replace("{server}", guildMember.guild.name);

        const customMessage =
          welcomeConfig.customMessage ||
          "Hey {user}👋. Welcome to {server}!";

        const welcomeMessage = customMessage
          .replace("{mention}", `<@${guildMember.id}>`)
          .replace("{user}", guildMember.user.username)
          .replace("{server}", guildMember.guild.name);

        Font.loadDefault();
        const card = new GreetingsCard()
          .setAvatar(guildMember.user.displayAvatarURL())
          .setBackgroundImage(customimageURL)
          .setDisplayName(guildMember.user.username)
          .setType("welcome")
          .setMessage(imageDescription);
        const image = await card.build({ format: "png" });
        const attachment = new AttachmentBuilder(image);
        if (welcomeConfig.enableImage) {
          targetChannel
            .send({ content: welcomeMessage, files: [attachment] })
            .catch((eror) => {
              console.log(eror);
            });
        } else {
          targetChannel.send({ content: welcomeMessage }).catch((eror) => {
            console.log(eror);
          });
        }
      }
    } catch (error) {
      console.log(`Error in ${__filename}:\n`, error);
    }
  },
};
