const Parser = require("rss-parser");
const parser = new Parser();
const fs = require("fs");
const { EmbedBuilder } = require("discord.js");

module.exports = async (client) => {
  client.checkVideo = async () => {
    const data = await parser
      .parseURL(
        "https://www.youtube.com/feeds/videos.xml?channel_id=UCa78NuGZqaApCcvGtsbVsLw"
      )
      .catch(console.error);

    const rawData = fs.readFileSync(`${__dirname}/../../json/video.json`);
    const jsonData = JSON.parse(rawData);
    //console.log(jsonData, data);

    if (!data.items || data.items.length === 0) {
      console.log("No videos found");
      return;
    }

    if (jsonData.id !== data.items[0].id) {
      //new video or video not sent
      fs.writeFileSync(
        `${__dirname}/../../json/video.json`,
        JSON.stringify({ id: data.items[0].id })
      );

      const guild = await client.guilds
        .fetch("770447702860759050")
        .catch(console.error);
      const channel = await guild.channels
        .fetch("1198095643072286810")
        .catch(console.error);
      const { title, link, id, author } = data.items[0];
      const embed = new EmbedBuilder({
        title: title,
        url: link,
        timestamp: Date.now(),
        image: {
          url: `https://img.youtube.com/vi/${id.slice(9)}/maxresdefault.jpg`,
        },
        author: {
          name: author,
          iconURL: `https://yt3.ggpht.com/yti/AGOGRCp2USeID07RNPFRCimLTDXidV998qtXT3dLZnQy=s88-c-k-c0x00ffffff-no-rj`,
          url: `https://www.youtube.com/channel/UCa78NuGZqaApCcvGtsbVsLw/?sub_confirmation=1`,
        },
        footer: {
          text: client.user.tag,
          iconURL: client.user.displayAvatarURL(),
        },
      });
      await channel
        .send({
          embeds: [embed],
          content: `Hey @everyone check out the new video!`,
        })
        .catch(console.error);
    }
  };
};
