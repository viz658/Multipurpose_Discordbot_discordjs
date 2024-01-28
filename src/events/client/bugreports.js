const { InteractionType, EmbedBuilder } = require("discord.js");
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.type == InteractionType.ModalSubmit) return;

    if (interaction.customId === "bugreport") {
      const command = interaction.fields.getTextInputValue("command");
      const description = interaction.fields.getTextInputValue("description");

      const id = interaction.user.id;
      const member = interaction.member;
      const server = interaction.guild.id || "No server found";

      const channel = await client.channels.cache.get("1201085527101800508");
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle(`⚠️🚨Bug report ${member}!🚨⚠️`)
        .addFields({ name: `User ID`, value: `${id}` })
        .addFields({ name: `User`, value: `${member}` })
        .addFields({ name: `Server ID`, value: `${server}` })
        .addFields({ name: `Command Reported`, value: `${command}` })
        .addFields({ name: `Description`, value: `${description}` })
        .setTimestamp()
        .setFooter({ text: "Vizguard bug reports" });

      await channel.send({ embeds: [embed] }).catch((err) => {});
      const sentembed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(`✅ Your bug report has been sent to the devs.`);
      await interaction.reply({ embeds: [sentembed], ephemeral: true });
    }
  },
};
