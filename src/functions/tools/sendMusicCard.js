const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const fs = require("fs");
const { musicCard } = require("musicard");


module.exports = (client) => {
  client.sendMusicCard = async (queue, song) => {
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
      .setLabel("⏸️Pause")
      .setStyle(ButtonStyle.Secondary);

    const resumeButton = new ButtonBuilder()
      .setCustomId("resume")
      .setLabel("▶️Resume")
      .setStyle(ButtonStyle.Secondary);

    const skipButton = new ButtonBuilder()
      .setCustomId("skip")
      .setLabel("➡️Skip")
      .setStyle(ButtonStyle.Danger);

    // Create a new action row for the additional buttons
    const stopButton = new ButtonBuilder()
      .setCustomId("stop")
      .setLabel("🛑Stop")
      .setStyle(ButtonStyle.Primary);

    const volumeUpButton = new ButtonBuilder()
      .setCustomId("volumeUp")
      .setLabel("🔊Volume Up")
      .setStyle(ButtonStyle.Success);

    const volumeDownButton = new ButtonBuilder()
      .setCustomId("volumeDown")
      .setLabel("🔉Volume Down")
      .setStyle(ButtonStyle.Danger);

    const repeat = new ButtonBuilder()
      .setCustomId("repeat")
      .setLabel("🔁Repeat")
      .setStyle(ButtonStyle.Danger);

    const shuffle = new ButtonBuilder()
      .setCustomId("shuffle")
      .setLabel("🔀Shuffle")
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
  };
};
