const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops the math process"),
    category: "community",
  async execute(interaction, client) {
    if (interaction.channel.id === global.channelId) {
      const embed = new EmbedBuilder()
        .setTitle("Answer:")
        .setDescription(`**${global.sum}**`)
        .setColor(0x18e1ee)
        .setTimestamp(Date.now());

      global.expressions.forEach((item, index) => {
        embed.addFields({
          name: `Expression ${index + 1}`,
          value: `${item.username} : ${item.expression} = ${item.result}`,
        });
      });

      if (interaction.commandName === "stop") {
        global.isListening = false;
        client.off("messageCreate", global.handleMessage);
        await interaction.reply({
          embeds: [embed],
        });
        global.sum = 0;
        global.hasStarted = false;
        global.expressions = [];
      }
    } else {
      await interaction.reply(
        "You can't stop the math process in this channel."
      );
    }
  },
};
