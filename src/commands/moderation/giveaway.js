const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder, ChannelType
} = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Giveaway system")
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("start")
        .setDescription("Start a giveaway")
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription("Giveaway duration, ex: 1m 1d 1h")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("winners")
            .setDescription("Number of winners")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("prize")
            .setDescription("Giveaway Prize")
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Channel to start the giveaway in")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("Message to send with the giveaway")
            .setRequired(false)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("edit")
        .setDescription("Edit a giveaway")
        .addStringOption((option) =>
          option
            .setName("messageid")
            .setDescription("Message ID of the giveaway")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription("Add more duration of the giveaway in ms")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("winners")
            .setDescription("New number of winners")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("prize")
            .setDescription("New prize of the giveaway")
            .setRequired(false)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("end")
        .setDescription("End a giveaway")
        .addStringOption((option) =>
          option
            .setName("messageid")
            .setDescription("Message ID of the giveaway")
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("reroll")
        .setDescription("Reroll a giveaway")
        .addStringOption((option) =>
          option
            .setName("messageid")
            .setDescription("Message ID of the giveaway")
            .setRequired(true)
        )
    ),
  category: "moderation",
  async execute(interaction, client) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageChannels
      )
    ) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "⚠️You do not have the required permissions to use this command⚠️"
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    const sub = interaction.options.getSubcommand();
    switch (sub) {
      case "start":
        const embed = new EmbedBuilder()
          .setColor("Blue")
          .setDescription("🔃 Starting giveaway...");
        await interaction.reply({ embeds: [embed], ephemeral: true });
        const duration = ms(interaction.options.getString("duration")) || "";
        const winnerCount = interaction.options.getInteger("winners");
        const prize = interaction.options.getString("prize");
        const contentmain = interaction.options.getString("message");
        const channel = interaction.options.getChannel("channel");
        const showchannel =
          interaction.options.getChannel("channel") || interaction.channel;
        if (!channel && !contentmain)
          client.giveawayManager.start(interaction.channel, {
            prize,
            winnerCount,
            duration,
            hostedBy: interaction.user,
            lastChance: {
              enabled: false,
              content: contentmain,
              threshold: 60000000000_000,
              embedColor: "#0af593",
            },
          });
        else if (!channel)
          client.giveawayManager.start(interaction.channel, {
            prize,
            winnerCount,
            duration,
            hostedBy: interaction.user,
            lastChance: {
              enabled: true,
              content: contentmain,
              threshold: 60000000000_000,
              embedColor: "#0af593",
            },
          });
        else if (!contentmain)
          client.giveawayManager.start(channel, {
            prize,
            winnerCount,
            duration,
            hostedBy: interaction.user,
            lastChance: {
              enabled: false,
              content: contentmain,
              threshold: 60000000000_000,
              embedColor: "#0af593",
            },
          });
        else
          client.giveawayManager.start(channel, {
            prize,
            winnerCount,
            duration,
            hostedBy: interaction.user,
            lastChance: {
              enabled: true,
              content: contentmain,
              threshold: 60000000000_000,
              embedColor: "#0af593",
            },
          });
        const embed2 = new EmbedBuilder()
          .setColor("Green")
          .setDescription(`🎉 Giveaway started in ${showchannel}`);

        await interaction.editReply({ embeds: [embed2], ephemeral: true });
        break;
      case "edit":
        const embed3 = new EmbedBuilder()
          .setColor("Blue")
          .setDescription("🔃 Editing giveaway...");
        await interaction.reply({ embeds: [embed3], ephemeral: true });
        const newprize = interaction.options.getString("prize");
        const newduration = interaction.options.getString("duration");
        const newwinners = interaction.options.getInteger("winners");
        const messageId = interaction.options.getString("messageid");
        client.giveawayManager
          .edit(messageId, {
            addTime: ms(newduration),
            newWinnerCount: newwinners,
            newPrize: newprize,
          })
          .then(async () => {
            const embed4 = new EmbedBuilder()
              .setColor("Green")
              .setDescription("✅ Giveaway edited");
            await interaction.editReply({ embeds: [embed4], ephemeral: true });
          })
          .catch(async (err) => {
            const embed5 = new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                "⛔ | Something went wrong while editing this giveaway..."
              );
            await interaction.editReply({ embeds: [embed5], ephemeral: true });
          });
        break;
      case "end":
        const embed6 = new EmbedBuilder()
          .setColor("Blue")
          .setDescription("🔃 Ending giveaway...");
        await interaction.reply({ embeds: [embed6], ephemeral: true });
        const messageid1 = interaction.options.getString("messageid");
        client.giveawayManager
          .end(messageid1)
          .then(async () => {
            const embed7 = new EmbedBuilder()
              .setColor("Green")
              .setDescription("✅ Giveaway ended");
            await interaction.editReply({ embeds: [embed7], ephemeral: true });
          })
          .catch(async (err) => {
            const embed8 = new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                "⛔ | Something went wrong while ending this giveaway..."
              );
            await interaction.editReply({ embeds: [embed8], ephemeral: true });
          });
        break;
      case "reroll":
        const embed9 = new EmbedBuilder()
          .setColor("Blue")
          .setDescription("🔃 Rerolling giveaway...");
        await interaction.reply({ embeds: [embed9], ephemeral: true });

        const query = interaction.options.getString("messageid");
        const giveaway = client.giveawayManager.giveaways.find(
          (g) =>
            (g.guildId === interaction.guild.id && g.prize === query) ||
            client.giveawayManager.giveaways.find(
              (g) => g.guildId === interaction.guild.id && g.messageId === query
            )
        );
        if (!giveaway) {
          const embed10 = new EmbedBuilder()
            .setColor("Red")
            .setDescription("⛔ | No giveaway found with that message ID");
          await interaction.editReply({ embeds: [embed10], ephemeral: true });
        }
        const messageId2 = interaction.options.getString("messageid");
        client.giveawayManager
          .reroll(messageId2)
          .then(async () => {
            const embed11 = new EmbedBuilder()
              .setColor("Green")
              .setDescription("✅ Giveaway rerolled");
            await interaction.editReply({ embeds: [embed11], ephemeral: true });
          })
          .catch(async (err) => {
            const embed12 = new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                "⛔ | Something went wrong while rerolling this giveaway..."
              );
            await interaction.editReply({ embeds: [embed12], ephemeral: true });
          });
        break;
    }
  },
};
