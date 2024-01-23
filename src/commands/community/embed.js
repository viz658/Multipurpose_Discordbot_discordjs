const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Return embed.")
    .setDefaultMemberPermissions(0),
    category: "community",
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle("This is an embed")
      .setDescription("This is a description")
      .setColor(0x18e1ee)
      .setImage(client.user.displayAvatarURL())
      .setThumbnail(client.user.displayAvatarURL())
      .setTimestamp(Date.now())
      .setAuthor({
        url: "https://www.youtube.com/@iviz6781/featured",
        iconURL: interaction.user.displayAvatarURL(),
        name: interaction.user.tag,
      })
      .setFooter({
        iconURL: client.user.displayAvatarURL(),
        text: client.user.tag,
      })
      .setURL('https://www.youtube.com/@iviz6781/featured')
      .addFields([
        {
          name: "field1",
          value: "field val 1",
          inline: true,
        },
        {
          name: "field2",
          value: "field val 2",
          inline: true,
        },
      ]);

      await interaction.reply({
        embeds: [embed]
      })
  },
};
