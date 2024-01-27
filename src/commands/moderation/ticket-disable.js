const {
  PermissionsBitField,
  EmbedBuilder,
  SlashCommandBuilder,
} = require("discord.js");
const ticketSchema = require("../../schemas/tickets.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tickets-disable")
    .setDescription("Disable tickets for your server!")
    .setDMPermission(false),
  category: "moderation",
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "⚠️You do not have the required permissions to use this command.⚠️"
        );
      return await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
    const ticketchannel = await ticketSchema.findOne({
      Guild: interaction.guild.id,
    });
    if (!ticketchannel) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("⚠️You do not have tickets setup for this server.⚠️");
      return await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
    const category = interaction.guild.channels.cache.get(
      ticketchannel.Channel
    );
    if (!category) {
      return;
    }
    await category.children.cache.forEach((channel) => {
      channel.delete();
    });
    await ticketSchema.deleteMany({
      Guild: interaction.guild.id,
    });
    const confirmedembed = new EmbedBuilder()
      .setColor("Green")
      .setDescription("✅Successfully disabled ticket system for this server");
    await interaction.reply({ embeds: [confirmedembed] });
  },
};
