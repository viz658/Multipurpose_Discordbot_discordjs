const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear a number of messages in a channel")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of messages to clear")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to clear messages in")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    ),
  category: "moderation",
  async execute(interaction, client) {
    const { options } = interaction;
    const amount = options.getInteger("amount");
    const channel = options.getChannel("channel") || interaction.channel;
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageMessages
      )
    ) {
      const embed = new EmbedBuilder()
        .setTitle(
          "⚠️You don't have manage messsages permission to use this command!⚠️"
        )
        .setColor("Red");
      return await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    await channel.bulkDelete(amount).catch((err) => {
      return;
    });

    const embed = new EmbedBuilder()
      .setTitle(`✅Successfully cleared ${amount} messages!✅`)
      .setColor("Green");
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
