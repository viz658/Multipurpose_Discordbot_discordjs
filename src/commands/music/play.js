const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song or playlist.")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Provide the name or url for the song.")
        .setRequired(true)
    ),
  category: "music",
  async execute(interaction, client) {
    await interaction.deferReply();
    const { options, member, guild, channel } = interaction;

    const query = options.getString("query");
    const voiceChannel = member.voice.channel;

    const embed = new EmbedBuilder();

    if (!voiceChannel) {
      embed
        .setColor("Red")
        .setDescription(
          "⚠️You must be in a voice channel to execute music commands.⚠️"
        );
      return interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    if (!member.voice.channelId == guild.members.me.voice.channelId) {
      embed
        .setColor("Red")
        .setDescription(
          `⚠️You can't use the music player as it is already active in <#${guild.members.me.voice.channelId}>⚠️`
        );
      return interaction.editReply({ embeds: [embed], ephemeral: true });
    }
    let play = true;
      await client.distube.play(voiceChannel, query, {
        textChannel: channel,
        member: member,
      }).catch( async err => {
        console.log(err); //private playlist or too long of a video
        embed.setColor("Red").setDescription("⛔ | Something went wrong... Make sure the song is not private or too long.");
        play = false;
        return await interaction.editReply({ embeds: [embed], ephemeral: true });
      });
      if(play) {
      embed.setColor("Green").setDescription(`🎶 | Request received. Joining <#${guild.members.me.voice.channelId}>`);
      await interaction.editReply({
        embeds: [embed],
        ephemeral: true,
      });
    }
  },
};
