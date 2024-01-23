const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reactor")
    .setDescription("Returns reactions"),
    category: "community",
  async execute(interaction, client) {
    const message = await interaction.reply({
      content: `React to this message!`,
      fetchReply: true,
    });
    const emoji = "👍";
    message.react(emoji);

    const filter = (reaction, user) => {
      return reaction.emoji.name === emoji && user.id === interaction.user.id;
    };

    const collector = message.createReactionCollector({ filter, time: 15000 });

    collector.on("collect", (reaction, user) => {
      console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
    });

    collector.on("end", (collected) => {
      console.log(`Collected ${collected.size} items`);
    });
  },
};
