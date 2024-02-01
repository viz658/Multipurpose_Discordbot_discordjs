module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    

    if (!interaction.isButton()) return;

    const filter = (i) =>
      [
        "pause",
        "resume",
        "skip",
        "stop",
        "volumeUp",
        "volumeDown",
        "shuffle",
        "repeat",
      ].includes(i.customId) && i.user.id === interaction.user.id;

    if (filter(interaction)) {
      const queue = client.distube.getQueue(interaction.guildId);
      if (!queue) return;

      if (interaction.customId === "pause") {
        client.distube.pause(interaction.guild);
        await interaction.update({ content: "⏸ Music paused." });
      } else if (interaction.customId === "resume") {
        if (!queue.pause) {
          await interaction.update({
            content: "▶️ Music is not paused.",
            ephemeral: true,
          });
        } else {
          client.distube.resume(interaction.guild);
          await interaction.update({ content: "▶️ Music resumed." });
        }
      } else if (interaction.customId === "skip") {
        if (queue.songs.length <= 1) {
          await interaction.update({
            content: "⚠️ Not enough songs in the queue to skip.",
            ephemeral: true,
          });
        } else {
          client.distube.skip(interaction.guild);
          await interaction.update({ content: "⏭️ Song skipped." });
        }
      } else if (interaction.customId === "stop") {
        client.distube.stop(interaction.guild);
        //delete attachment and message sent by play.js
        await interaction.update({ content: "⏹️ Music stopped." });
        if (queue.currentMessage) {
          queue.currentMessage.delete().catch(console.error);
          queue.currentMessage = undefined;
        }
        await interaction.followUp({
          content: "⏹️ Music stopped. Disconnecting...",
          ephemeral: true,
        });
      } else if (interaction.customId === "volumeUp") {
        if (queue.volume >= 100) {
          await interaction.update({
            content: "🔊 Volume is already at maximum (100%)",
          });
        } else {
          const newVolume = Math.min(queue.volume + 10, 100);
          client.distube.setVolume(interaction.guild, newVolume);
          await interaction.update({
            content: `🔊 Volume increased to ${newVolume}%`,
          });
        }
      } else if (interaction.customId === "volumeDown") {
        if (queue.volume <= 0) {
          await interaction.update({
            content: "🔉 Volume is already at minimum (0%)",
          });
        } else {
          const newVolume = Math.max(queue.volume - 10, 0);
          client.distube.setVolume(interaction.guild, newVolume);
          await interaction.update({
            content: `🔉 Volume decreased to ${newVolume}%`,
          });
        }
      } else if (interaction.customId === "shuffle") {
        if (!queue.songs.length || queue.songs.length === 1) {
          await interaction.update({
            content: "⚠️ Not enough songs in the queue to shuffle.",
          });
        } else {
          client.distube.shuffle(interaction.guild);
          await interaction.update({ content: "🔀 Queue shuffled." });
        }
      } else if (interaction.customId === "repeat") {
        if (!queue.songs.length) {
          await interaction.update({
            content: "⚠️ No songs in the queue to repeat.",
          });
        } else {
          const repeatMode = queue.repeatMode;
          client.distube.setRepeatMode(
            interaction.guild,
            repeatMode === 0 ? 1 : 0
          );
          await interaction.update({
            content: `🔁 Repeat mode set to ${
              repeatMode === 0 ? "queue" : "off"
            }`,
          });
        }
      }
    }
  },
};
