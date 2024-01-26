const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const math = require("mathjs");

global.hasStarted = false;
global.isListening = false;
global.sum = 0;
global.channelId = null;
global.expressions = [];

global.handleMessage = function (message) {
  if (
    global.isListening &&
    message.content &&
    message.channel.id === global.channelId
  ) {
    try {
      global.hasStarted = true;
      const result = math.evaluate(message.content.replace(/x/gi, "*"));
      if (typeof result === "number") {
        global.sum += result;
        message.react("✅");
        global.expressions.push({
          expression: message.content,
          result: result,
          username: message.author.username,
        });
      }
    } catch (error) {
      message.react("❌");
      console.error("Failed to evaluate expression:", error);
    }
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Starts the math process")
    .setDMPermission(false),
  category: "community",
  async execute(interaction, client) {
    if (interaction.commandName === "start" && !global.hasStarted) {
      global.isListening = true;
      global.channelId = interaction.channel.id;
      const embed = new EmbedBuilder()
        .setDescription("✅ Starting math process... Send equations!")
        .setColor("Green")
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
      client.on("messageCreate", global.handleMessage);
    } else {
      await interaction.reply({
        content: "The math process has already started in another channel",
        ephemeral: true,
      });
    }
  },
};
