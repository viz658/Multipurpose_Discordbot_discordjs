const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const levelbackgroundSchema = require("../../schemas/Levelbackground.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("level-bg")
    .setDescription("Change the background of the level card.")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("background")
        .setDescription("The background image URL.")
        .setRequired(true)
    ),
  category: "moderation",
  async execute(interaction, client) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("⚠️You do not have permission to use this command.⚠️");
      return interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
    const customimageURL = interaction.options.getString("background");
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
    await levelbackgroundSchema.findOneAndUpdate(
      {
        guildId: interaction.guild.id,
      },
      {
        guildId: interaction.guild.id,
        levelurl: customimageURL,
      },
      {
        upsert: true,
      }
    );
    const embed = new EmbedBuilder()
      .setThumbnail(customimageURL)
      .setColor("Green")
      .setDescription(
        "✅Level card background has been updated to thumbnail... \n if the image you set the url to is not in the thumbnail the url you gave is not a valid image url it may be a redirect url"
      )
      .setFooter({
        text: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      });
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
