const {
  SlashCommandBuilder,
  ChannelType,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} = require("discord.js");
const GuildConfiguration = require("../../schemas/GuildConfiguration");
/**
 *
 * @param {Object} param0
 * @param {ChatInputCommandInteraction} param0.interaction
 */

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config-suggestions")
    .setDescription("Configure suggstions.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a suggestions channel.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel you want to add.")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a suggestions channel.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel you want to remove.")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    ),
  category: "moderation",
  async execute(interaction, client) {
    let guildConfiguration = await GuildConfiguration.findOne({
      guildId: interaction.guildId,
    });

    if (!guildConfiguration) {
      guildConfiguration = new GuildConfiguration({
        guildId: interaction.guildId,
      });
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "add") {
      const channel = interaction.options.getChannel("channel");

      if (guildConfiguration.suggestionChannelId === channel.id) {
        await interaction.reply({
          content: `${channel} is already a suggestions channel.`,
          ephemeral: true,
        });
        return;
      }

      guildConfiguration.suggestionChannelId = channel.id;
      await guildConfiguration.save();

      await interaction.reply({
        content: `Added ${channel} to suggestion channel.`,
        ephemeral: true,
      });
      return;
    }

    if (subcommand === "remove") {
      const channel = interaction.options.getChannel("channel");

      if (guildConfiguration.suggestionChannelId !== (channel.id)) {
        await interaction.reply({
          content: `${channel} is not a suggestion channel.`,
          ephemeral: true,
        });
        return;
      }

      await guildConfiguration.deleteOne();
      //await guildConfiguration.save();

      await interaction.reply({
        content: `Removed ${channel} as suggestion channel.`,
        ephemeral: true,
      });
      return;
    }
  },
};
