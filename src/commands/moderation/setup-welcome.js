const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");
const welcomeChannelSchema = require("../../schemas/WelcomeChannel.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-welcome-channel")
    .setDescription("Setup a channel to send welcome messages to.")
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
        .setDescription("Templates: {mention-member} {username} {server-name}")
    ),
  category: "moderation",
  async execute(interaction, client) {
    try {
      const targetChannel = interaction.options.getChannel("target-channel");
      const customMessage = interaction.options.getString("custom-message");

      await interaction.deferReply({ ephemeral: true });

      const query = {
        guildId: interaction.guildId,
        channelId: targetChannel.id,
      };

      const channelExistsInDb = await welcomeChannelSchema.exists(query);

      if (channelExistsInDb) {
        interaction.followUp(
          "This channel has already been configured for welcome messages."
        );
        return;
      }

      const newWelcomeChannel = new welcomeChannelSchema({
        ...query,
        customMessage,
      });

      newWelcomeChannel
        .save()
        .then(() => {
          interaction.followUp(
            `Configured ${targetChannel} to receive welcome messages.`
          );
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
