const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("embed-creator")
    .setDescription(
      "Create a custom embed - requires manage channels permissions"
    )
    .addStringOption((option) =>
      option
        .setName("color")
        .setDescription(
          "Color of the embed in six-digit hex format, include #, copy and paste from google color picker "
        )
        .setRequired(true)
        .setMinLength(7)
        .setMaxLength(7)
    )
    .addStringOption((option) =>
      option.setName("title").setDescription("Title of the embed")
    )
    .addStringOption((option) =>
      option.setName("description").setDescription("Description of the embed type \\n for new line")
    )
    .addStringOption((option) =>
      option.setName("image").setDescription("Image url for the embed")
    )
    .addStringOption((option) =>
      option.setName("thumbnail").setDescription("Thumbnail url for the embed")
    )
    .addStringOption((option) =>
      option.setName("field-name").setDescription("Field name for the embed")
    )
    .addStringOption((option) =>
      option.setName("field-value").setDescription("Field value for the embed")
    )
    .addStringOption((option) =>
      option.setName("footer").setDescription("Footer for the embed")
    ),
  category: "moderation",
  async execute(interaction, client) {
    const { options } = interaction;
    const title = options.getString("title") || " ";
    const description = (options.getString("description")|| " ").replace(/\\n/g, '\n'); 
    const color = options.getString("color");
    const image = options.getString("image");
    const thumbnail = options.getString("thumbnail");
    const fieldname = options.getString("field-name") || " ";
    const fieldvalue = options.getString("field-value") || " ";
    const footer = options.getString("footer") || " ";

    function isValidHexColor(hex) {
      const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      return regex.test(hex);
    }
    if (!isValidHexColor(color)) {
        const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("⚠️Please provide a valid hex color code⚠️");
        return await interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    }
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageChannels
      )
    ) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "⚠️You do not have manage channels permission to use this command.⚠️"
        );
      return await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
    if (image) {
      if (!image.startsWith("https://")) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription("⚠️Please provide a valid https:// image url⚠️");
        return await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }
    }
    if (thumbnail) {
      if (!thumbnail.startsWith("https://")) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription("⚠️Please provide a valid https:// thumbnail url⚠️");
        return await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }
    }

    const embed = new EmbedBuilder()
      .setTitle(`${title}`)
      .setDescription(`${description}`)
      .setColor(`${color}`)
      .setImage(image)
      .setThumbnail(thumbnail)
      .setTimestamp()
      .addFields({ name: `${fieldname}`, value: `${fieldvalue}` })
      .setFooter({
        text: `${footer}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });

    const confiredembed = new EmbedBuilder()
      .setColor("Green")
      .setDescription("✅ Your embed has been ceated below");

    await interaction.reply({ embeds: [confiredembed], ephemeral: true });
    await interaction.channel.send({ embeds: [embed] });
  },
};
