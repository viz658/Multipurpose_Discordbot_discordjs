const {
  PermissionsBitField,
  EmbedBuilder,
  ChannelType,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  SlashCommandBuilder,
} = require("discord.js");
const ticketSchema = require("../../schemas/tickets.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tickets-setup")
    .setDescription("Setup tickets for your server!")
    .setDMPermission(false)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel where tickets will be created.")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("category")
        .setDescription("The category where tickets will be created.")
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(true)
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
      return await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
    const channel = interaction.options.getChannel("channel");
    const category = interaction.options.getChannel("category");

    const data = await ticketSchema.findOne({
      Guild: interaction.guild.id,
      Channel: category.id,
    });
    if (!data) {
      ticketSchema.create({
        Guild: interaction.guild.id,
        Channel: category.id,
        Ticket: `first`,
      });
    } else {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("⚠️You already have tickets setup for this server.⚠️");
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }
    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("Create a Ticket")
      .setDescription("Click the button below to open a ticket!")
      .setFooter({
        text: `${interaction.guild.name} tickets`,
      });
    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("select")
        .setMinValues(1)
        .setPlaceholder("Select a topic...")
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel("General Support")
            .setValue("General Support")
            .setDescription("Get help with general issues."),
          new StringSelectMenuOptionBuilder()
            .setLabel("Moderation Support")
            .setValue("Moderation Support")
            .setDescription("Get help with moderation issues."),
          new StringSelectMenuOptionBuilder()
            .setLabel("Server Support")
            .setValue("Server Support")
            .setDescription("Get help with server issues."),
          new StringSelectMenuOptionBuilder()
            .setLabel("Other")
            .setValue("Other")
            .setDescription("Get help with moderation issues.")
        )
    );
    await channel.send({ embeds: [embed], components: [menu] });
    const confirmedembed = new EmbedBuilder()
      .setColor("Green")
      .setDescription("✅Successfully setup ticket system for this server");

    await interaction.reply({ embeds: [confirmedembed], ephemeral: true });
  },
};
