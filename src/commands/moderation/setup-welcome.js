const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");
const welcomeChannelSchema = require("../../schemas/WelcomeChannel.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-welcome-channel")
    .setDescription(
      "Setup a channel to send welcome messages to with optional greeting card images."
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName("target-channel")
        .setDescription("The channel to get welcome messages in.")
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("custom-message")
        .setDescription("Templates: {mention} {user} {server}")
    )
    .addStringOption((option) =>
      option
        .setName("image-description")
        .setDescription(
          "Description in welcome image, templates: {user} {server}"
        )
    )
    .addBooleanOption((option) =>
      option
        .setName("enable-image")
        .setDescription("Enable welcome image-off by default")
    )
    .addStringOption((option) =>
      option.setName("customimage").setDescription("Custom image URL")
    ),
  category: "moderation",
  async execute(interaction, client) {
    try {
      const targetChannel = interaction.options.getChannel("target-channel");
      const customMessage = interaction.options.getString("custom-message");
      const imageDescription =
        interaction.options.getString("image-description");
      const enableImage = interaction.options.getBoolean("enable-image");
      const customimageURL = interaction.options.getString("customimage");

      if (customimageURL) {
        try {
          new URL(customimageURL);
        } catch (error) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("⚠️Please enter a valid image URL⚠️");
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
      }
      await interaction.deferReply({ ephemeral: true });

      const query = {
        guildId: interaction.guildId,
        channelId: targetChannel.id,
      };

      const channelExistsInDb = await welcomeChannelSchema.exists(query);

      if (channelExistsInDb) {
        interaction.followUp(
          "⚠️This channel has already been configured for welcome messages.⚠️"
        );
        return;
      }

      const newWelcomeChannel = new welcomeChannelSchema({
        ...query,
        customMessage,
        imageDescription,
        enableImage,
        customimageURL,
      });
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(
          `✅ Configured ${targetChannel} to receive welcome messages.`
        );
      newWelcomeChannel
        .save()
        .then(() => {
          interaction.followUp({ embeds: [embed] });
        })
        .catch(() => {
          interaction.followUp("Database error. Please try again in a moment.");
          console.log(`DB eror in ${__filename}:\n`, error);
        });
    } catch (error) {
      console.log(`Error in ${__filename}:\n`, error);
    }
  },
};
