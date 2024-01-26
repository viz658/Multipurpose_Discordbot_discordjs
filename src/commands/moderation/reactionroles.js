const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const reaction = require("../../schemas/reactionrs.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reaction-roles")
    .setDescription("Create a reaction role system")
    .setDMPermission(false)
    .addSubcommand((command) =>
      command
        .setName("add")
        .setDescription("Add a reaction role to a message")
        .addStringOption((option) =>
          option
            .setName("message-id")
            .setDescription("The message to add the reaction role to")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("emoji")
            .setDescription("The emoji to react with")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to add to the user")
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("remove")
        .setDescription("Remove a reaction role to a message")
        .addStringOption((option) =>
          option
            .setName("message-id")
            .setDescription("The message to add the reaction role to")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("emoji")
            .setDescription("The emoji to react with")
            .setRequired(true)
        )
    ),
  category: "moderation",
  async execute(interaction, client) {
    const { options, guild, channel } = interaction;
    const sub = options.getSubcommand();
    const emoji = options.getString("emoji");

    let e;
    const message = await channel.messages
      .fetch(options.getString("message-id"))
      .catch((err) => {
        e = err;
      });

    if (
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator)
    ) {
      return await interaction.reply({
        content: "You don't have permission to use this command.",
        ephemeral: true,
      });
    }
    if (e) {
      return await interaction.reply({
        content: `Make sure to get a message from ${channel}`,
        ephemeral: true,
      });
    }
    const data = await reaction.findOne({
      Guild: guild.id,
      Message: message.id,
      Emoji: emoji,
    });

    switch (sub) {
      case "add":
        if (data) {
          return await interaction.reply({
            content: `There is already a reaction role for ${emoji} on this message.`,
            ephemeral: true,
          });
        } else {
          await reaction.create({
            Guild: guild.id,
            Message: message.id,
            Emoji: emoji,
            Role: options.getRole("role").id,
          });

          const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(
              `Successfully added a reaction role for ${
                message.url
              } with ${emoji} and role ${options.getRole("role")}`
            );

          await message.react(emoji).catch((err) => {});

          await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        break;

      case "remove":
        if (!data) {
          return await interaction.reply({
            content: `There is no reaction role for ${emoji} on this message.`,
            ephemeral: true,
          });
        } else {
          await reaction.deleteMany({
            Guild: guild.id,
            Message: message.id,
            Emoji: emoji,
          });

          message.reactions.cache
            .get(emoji)
            .remove()
            .catch((error) =>
              console.error("Failed to remove reactions:", error)
            );

          const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(
              `Successfully removed a reaction role for ${message.url} with ${emoji}`
            );

          await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        break;
    }
  },
};
