const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildDelete",

  async execute(guild, client) {
    const channel = await client.channels.cache.get("1201085797907042364");
    const name = guild.name;
    const memberCount = guild.memberCount;
    const ownerID = guild.ownerId;
    const owner = await client.users.cache.get(ownerID);
    const ownerName = owner.username;

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("❌ Removed from a server ☹️")
      .addFields({ name: `Server Name`, value: `> ${name}` })
      .addFields({ name: `Server Members`, value: `> ${memberCount}` })
      .addFields({ name: `Server Owner`, value: `> ${ownerName} / ${ownerID}` })
      .addFields({ name: `Server Creation `, value: `> ${guild.createdAt}` })
      .setTimestamp()
      .setFooter({ text: " Left a server " });

    await channel.send({ embeds: [embed] });
  },
};
