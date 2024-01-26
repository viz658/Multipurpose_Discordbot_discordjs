const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Enable slowmode in a channel")
    .setDMPermission(false)
    .addIntegerOption((option) =>
      option.setName("time").setDescription("Time in seconds").setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel to enable slowmode in")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    ),
  category: "moderation",
  async execute(interaction, client) {
    const { options } = interaction;
    const time = options.getInteger("time");
    const channel = options.getChannel("channel") || interaction.channel;
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageChannels
      )
    )
      return interaction.reply({
        content:
          "⚠️You do not have manage channels permission to use this command.⚠️",
        ephemeral: true,
      });
    let string = `✅ Slowmode has been set in ${channel} to ${time} seconds.`;
    let color = "Green";
    if (time === 0) {
      string = `❌ Slowmode has been disabled`;
      color = "Red";
    }

    const embed = new EmbedBuilder().setDescription(string).setColor(color);

    channel.setRateLimitPerUser(time).catch((err) => {
      return;
    });

    await interaction.reply({ embeds: [embed] });
  },
};
