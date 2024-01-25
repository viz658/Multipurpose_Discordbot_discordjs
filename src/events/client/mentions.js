const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    async function sendMessage(reply) {
      const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Heres how you use me!")
        .setDescription(
          "See a list of commands and how to invite me by running /help "
        )
        .setTimestamp();
      if (!reply) {
        await message.reply({ embeds: [embed] });
      } else {
        embed.setFooter({
          text: `If your intention was not to recieve this message use the delete button below`,
        });
        const button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("delete")
            .setLabel("🗑️ Delete")
            .setStyle(ButtonStyle.Danger)
        );

        const msg = await message.reply({
          embeds: [embed],
          components: [button],
        });
        const collector = await msg.createMessageComponentCollector();
        collector.on("collect", async (i) => {
          if (i.customId == "delete") {
            await msg.delete();
          }
        });
      }
    }

    if (message.mentions.users.first() == client.user) {
      if (message.reference) {
        await sendMessage(true);
      } else {
        sendMessage();
      }
    }
  },
};
