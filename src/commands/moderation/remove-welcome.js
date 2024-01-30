const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");
const welcomeChannelSchema = require("../../schemas/WelcomeChannel.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove-welcome-channel")
    .setDescription("Remove a welcome channel.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName("target-channel")
        .setDescription("The channel to remove welcome messages from.")
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setRequired(true)
    ),
  category: "moderation",
  async execute(interaction, client) {
    try {
      const targetChannel = interaction.options.getChannel("target-channel");

      await interaction.deferReply({ ephemeral: true });

      const query = {
        guildId: interaction.guildId,
        channelId: targetChannel.id,
      };

      const channelExistsInDb = await welcomeChannelSchema.exists(query);

      if (!channelExistsInDb) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "⚠️That channel has not been configured for welcome messages.⚠️"
          );
        interaction.followUp({ embeds: [embed] });
        return;
      }
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(
          `✅ Removed ${targetChannel} from receiving welcome messages.`
        );
      welcomeChannelSchema
        .findOneAndDelete(query)
        .then(() => {
          interaction.followUp({ embeds: [embed] });
        })
        .catch((error) => {
          interaction.followUp("Database error. Please try again in a moment.");
          console.log(`DB error in ${__filename}:\n`, error);
        });
    } catch (error) {
      console.log(`Error in ${__filename}:\n`, error);
    }
  },
};
