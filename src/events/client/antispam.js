const { EmbedBuilder } = require("discord.js");
const antispamdetectSchema = require("../../schemas/antispamdetect.js");
const antispamsetupSchema = require("../../schemas/antispamsetup.js");
var cnt = 0;

module.exports = {
  name: "messageCreate",
  async execute(message,client) {
    if (message.author.bot) return;
    if (!message.guild) return;

    let spamdetect = await antispamdetectSchema.findOne({
      Guild: message.guild.id,
      User: message.author.id,
    });
    let setupdata = await antispamsetupSchema.findOne({
      Guild: message.guild.id,
    });

    if (!setupdata) return;

    if (spamdetect) {
      const query = { Guild: message.guild.id, User: message.author.id };
      const update = { Count: cnt, Time: Date.now() };

      await antispamdetectSchema.updateOne(query, { $set: update });
    } else {
      await antispamdetectSchema.create({
        Guild: message.guild.id,
        User: message.author.id,
        Count: cnt,
        Time: Date.now(),
      });
    }
    if (!spamdetect) return;
    let execute;
    cnt++;
    if ((Date.now() - spamdetect.Time) / 1000 <= 5 && cnt >= 5) {
      const member = await message.guild.members.fetch(message.author.id);
      const messages = await message.channel.messages.fetch();
      var memberMessages = [];

      messages.forEach(async (m) => {
        if (m.author.id == member.id && memberMessages.length < 5) {
          memberMessages.push(m.id);
        }
      });

      memberMessages.forEach(async (val) => {
        const fetchMessage = await message.channel.messages.fetch(val);
        await fetchMessage.delete().catch((err) => {});
      });
      var err;
      await member.timeout(60000).catch((err) => {
        err = true;
      });
      cnt = 0;
      await spamdetect.deleteOne({
        Guild: message.guild.id,
        User: message.author.id,
      });
      if (err) return;
      else execute = true;
    }

    if (execute) {
      const embed = new EmbedBuilder()
        .setDescription(
          `⚠️You have been timed out for spamming in ${message.guild.name}!⚠️`
        )
        .setColor("Red")
        .setTimestamp();
      await message.author.send({ embeds: [embed] }).catch((err) => {});
      if (setupdata.Channel) {
        var channel = await message.guild.channels.fetch(setupdata.Channel);
        if (channel) {
          const embed = new EmbedBuilder()
            .setDescription(
              `⚠️${message.author} has been timed out for spamming in ${message.channel}!`
            )
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setFields({ name: `UserID:`, value: `${message.author.id}` })
            .setColor("Red")
            .setFooter({
              text: "You can disable mute logs by running /antispam disable and enable antispam again.",
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();
          await channel.send({ embeds: [embed] }).catch((err) => {});
        }
      }
    }
  },
};
