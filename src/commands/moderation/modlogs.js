const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
  PermissionsBitField,
} = require("discord.js");
const modlogs = require("../../schemas/Modlogs.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("modlogs")
    .setDescription("Set the modlogs channel for the server")
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Set the modlogs channel for the server")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to set as the modlogs channel")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("disable")
        .setDescription("Disable the modlogs for the server")
    ),
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
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }
    const subcommand = interaction.options.getSubcommand();
    const channel = interaction.options.getChannel("channel");
    const data = await modlogs.findOne({
      Guild: interaction.guild.id,
    });
    switch (subcommand) {
      case "set":
        if (data) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("⚠️Mod logs is already set for this server.⚠️");
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
          const newmodlogs = new modlogs({
            Guild: interaction.guild.id,
            Channel: channel.id,
          });
          await newmodlogs.save();
          const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              `✅Mod logs has been set to ${channel} for this server.`
            );
          await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        break;
      case "disable":
        if (!data) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("⚠️Mod logs is not enabled for this server.⚠️");
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
          await modlogs.findOneAndDelete({ Guild: interaction.guild.id });
          const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription("✅Mod logs has been disabled for this server.");
          await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        break;
    }
  },
};
