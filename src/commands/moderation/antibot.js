const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const bot = require("../../schemas/antibot.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("antibot")
    .setDescription("Enable or disable the anti bot feature.")
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("enable")
        .setDescription("Enable the anti bot feature.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("disable")
        .setDescription("Disable the anti bot feature.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("whitelist")
        .setDescription(
          "Whitelist a bot from the anti bot system copy id of bot -enable developer mode"
        )
        .addStringOption((option) =>
          option
            .setName("botid")
            .setDescription("The bot you want to whitelist.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove-whitelist")
        .setDescription(
          "Remove a bot from the antibot whitelist use the bot id"
        )
        .addStringOption((option) =>
          option
            .setName("botidwl")
            .setDescription("The bot you want to remove from the whitelist.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("view-whitelist")
        .setDescription(
          "View a list of ids of bots on the anti bot whitelist"
        )
    ),
  category: "moderation",
  async execute(interaction) {
    const { options } = interaction;
    const sub = options.getSubcommand();
    const botid = options.getString("botid");
    const removebotid = options.getString("botidwl");
    const data = await bot.findOne({ Guild: interaction.guild.id });
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "⚠️You do not have administrator permission to use this command!⚠️"
        );
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    } else {
      if (sub === "enable") {
        if (data) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("⚠️Anti bot is already enabled!⚠️");
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
          const newData = new bot({
            Guild: interaction.guild.id,
          });
          newData.save();
          const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              "✅Anti bot has been enabled. Bots will now be automatically kicked."
            );
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
      }
      if (sub === "disable") {
        if (!data) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("⚠️Anti bot is not set up on this server!⚠️");
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
          await bot.findOneAndDelete({ Guild: interaction.guild.id });
          const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription("✅Anti bot has been disabled.");
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
      }
      if (sub === "whitelist") {
        if (!data) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("⚠️Anti bot will need to be enabled first!⚠️")
            .setFooter(
              "Save the bot id you want to whitelist then /antibot enable and try again"
            );
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        } else if (!botid) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("⚠️Please provide a bot id!⚠️");
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
          const botdata = await bot.findOne({ Guild: interaction.guild.id });
          if (botdata.WhitelistedBots.includes(botid)) {
            const embed = new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                "⚠️This bot is already whitelisted from the antibot system!⚠️"
              );
            return await interaction.reply({
              embeds: [embed],
              ephemeral: true,
            });
          } else {
            botdata.WhitelistedBots.push(botid);
            botdata.save();
            const embed = new EmbedBuilder()
              .setColor("Green")
              .setDescription(
                "✅Successfully whitelisted the bot from anti bot system."
              );
            return await interaction.reply({
              embeds: [embed],
              ephemeral: true,
            });
          }
        }
      }
      if( sub === "remove-whitelist") {
        if (!data) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("⚠️Anti bot will need to be enabled first!⚠️")
            .setFooter(
              "Save the bot id you want to whitelist then /antibot enable and try again"
            );
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        } else if (!removebotid) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("⚠️Please provide a bot id!⚠️");
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
          const botdata = await bot.findOne({ Guild: interaction.guild.id });
          if (!botdata.WhitelistedBots.includes(removebotid)) {
            const embed = new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                "⚠️This bot is not whitelisted from the antibot system!⚠️"
              );
            return await interaction.reply({
              embeds: [embed],
              ephemeral: true,
            });
          } else {
            botdata.WhitelistedBots.splice(botdata.WhitelistedBots.indexOf(removebotid), 1);
            botdata.save();
            const embed = new EmbedBuilder()
              .setColor("Green")
              .setDescription(
                "✅Successfully removed the bot from the antibot whitelist."
              );
            return await interaction.reply({
              embeds: [embed],
              ephemeral: true,
            });
          }
        }
      }
      if (sub === "view-whitelist") {
        if (!data) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("⚠️Anti bot will need to be enabled first!⚠️")
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
          const botdata = await bot.findOne({ Guild: interaction.guild.id });
          const embed = new EmbedBuilder()
            .setColor("White")
            .setDescription(
              `Here is a list of whitelisted bots:\n${botdata.WhitelistedBots.join(
                "\n"
              )}`
            );
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
      }
    }
  },
};
