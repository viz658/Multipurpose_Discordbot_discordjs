const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Evaluate javascript code (dev only)")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("The code to evaluate")
        .setRequired(true)
    ),
  category: "moderation",
  async execute(interaction, client) {
    async function sendMessage(message) {
      const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setDescription(message);

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (interaction.member.id !== "273972106415439872")
      return await sendMessage("Only **developers** can use this command.");

    const { options } = interaction;

    var code = options.getString("code");
    var output;

    try {
      output = await eval(code);
    } catch (error) {
      output = error.toString();
    }

    var replyString = `**Input: **\n\`\`\`js\n${code}\n\`\`\`\n**Output:**\n\`\`\`js\n${output}\n\`\`\``;

    if (interaction.replied) {
      const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setDescription(replyString);

      await interaction.editReply({
        content: "",
        embeds: [embed],
        ephemeral: true,
      });
    } else {
      await sendMessage(replyString);
    }
  },
};
