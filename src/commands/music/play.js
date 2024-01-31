const {
  EmbedBuilder,
  SlashCommandBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const fs = require("fs");
const { musicCard } = require("musicard");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Provide the name or url for the song.")
        .setRequired(true)
    ),
  category: "music",
  async execute(interaction, client) {
    async function sendMusicCard(queue, song) {
      // Create a music card
      const card = new musicCard()
        .setName(song.name)
        .setAuthor(`By ${song.user.username}`)
        .setColor("auto")
        .setTheme("classic")
        .setBrightness(50)
        .setThumbnail(song.thumbnail)
        .setProgress(10)
        .setStartTime("0:00")
        .setEndTime(song.formattedDuration);

      // Build the card and save it as musicard.png
      const cardBuffer = await card.build();
      fs.writeFileSync(`musicard.png`, cardBuffer);

      // Create the button components
      const pauseButton = new ButtonBuilder()
        .setCustomId("pause")
        .setLabel("Pause")
        .setStyle(ButtonStyle.Secondary);

      const resumeButton = new ButtonBuilder()
        .setCustomId("resume")
        .setLabel("Resume")
        .setStyle(ButtonStyle.Secondary);

      const skipButton = new ButtonBuilder()
        .setCustomId("skip")
        .setLabel("Skip")
        .setStyle(ButtonStyle.Danger);

      // Create a new action row for the additional buttons
      const stopButton = new ButtonBuilder()
        .setCustomId("stop")
        .setLabel("Stop")
        .setStyle(ButtonStyle.Primary);

      const volumeUpButton = new ButtonBuilder()
        .setCustomId("volumeUp")
        .setLabel("Volume Up")
        .setStyle(ButtonStyle.Success);

      const volumeDownButton = new ButtonBuilder()
        .setCustomId("volumeDown")
        .setLabel("Volume Down")
        .setStyle(ButtonStyle.Danger);

      const repeat = new ButtonBuilder()
        .setCustomId("repeat")
        .setLabel("Repeat")
        .setStyle(ButtonStyle.Danger);

      const shuffle = new ButtonBuilder()
        .setCustomId("shuffle")
        .setLabel("Shuffle")
        .setStyle(ButtonStyle.Danger);

      // Create action row components
      const row1 = new ActionRowBuilder().addComponents(
        pauseButton,
        resumeButton,
        skipButton,
        stopButton
      );

      const row2 = new ActionRowBuilder().addComponents(
        volumeUpButton,
        volumeDownButton,
        shuffle,
        repeat
      );

      // Send the music card along with the playSong event
      queue.textChannel
        .send({
          //content: `🎶 Now Playing: ${song.name}Requested by: ${song.user.username}`,
          components: [row1, row2],
          files: [`musicard.png`], // Send the saved music card image as a file
        })
        .then((message) => {
          queue.currentMessage = message;
        })
        .catch(console.error);
    }

    const { options, member, guild, channel } = interaction;

    const query = options.getString("query");
    const voiceChannel = member.voice.channel;

    const embed = new EmbedBuilder();

    if (!voiceChannel) {
      embed
        .setColor("#457cf0")
        .setDescription(
          "You must be in a voice channel to execute music commands."
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!member.voice.channelId == guild.members.me.voice.channelId) {
      embed
        .setColor("#457cf0")
        .setDescription(
          `You can't use the music player as it is already active in <#${guild.members.me.voice.channelId}>`
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      await client.distube.play(voiceChannel, query, {
        textChannel: channel,
        member: member,
      });
      const queue = client.distube.getQueue(interaction.guildId);
      const song = queue.songs[0];
      await interaction.reply({
        content:
          "🎶 Request received. Make sure the Bot has required permissions.",
        ephemeral: true,
      });
      // Send the music card
      await sendMusicCard(queue, song).catch(console.error);
    } catch (err) {
      console.log(err);

      embed.setColor("#457cf0").setDescription("⛔ | Something went wrong...");

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
