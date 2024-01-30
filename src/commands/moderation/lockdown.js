const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");
const Lockdown = require("../../schemas/Lockdown.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lockdown")
    .setDescription("-Messages and connnect to channels are disabled- warning this is an advanced command")
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand.setName("enable").setDescription("Locks the server")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("disable").setDescription("Unlocks the server")
    ),
  category: "moderation",
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "⚠️You do not have the required permissions to use this command!⚠️"
        );
      return await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
    const data = await Lockdown.findOne({
      Guild: interaction.guild.id,
    });

    if (sub === "enable") {
      if (!data) {
        const embed1 = new EmbedBuilder()
          .setColor("Green")
          .setDescription("✅ Locking down the server...");
        await interaction.reply({ embeds: [embed1] });
        const newData = new Lockdown({
          Guild: interaction.guild.id,
        });
        await newData.save();
        const textchannels = interaction.guild.channels.cache.filter(
          (c) => c.type === ChannelType.GuildText
        );
        const voicechannels = interaction.guild.channels.cache.filter(
          (c) => c.type === ChannelType.GuildVoice
        );
        textchannels.forEach(async (channel) => {
          await channel.permissionOverwrites.edit(
            interaction.guild.roles.everyone,
            {
              SendMessages: false,
            }
          );
        });
        voicechannels.forEach(async (channel) => {
          await channel.permissionOverwrites.edit(
            interaction.guild.roles.everyone,
            {
              Connect: false,
            }
          );
        });
        const embed2 = new EmbedBuilder()
          .setColor("Red")
          .setDescription("⚠️🚨The server is now on lockdown!🚨⚠️")
          .setFooter({text: "Send messages and connect to channels are now disabled"});

        return await interaction.editReply({ embeds: [embed2]});
      } else {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription("⚠️Lockdown is already enabled on this server!⚠️");
        return await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }
    } else if (sub === "disable") {
      if (!data) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription("⚠️Lockdown is not enabled on this server!⚠️");
        return await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      } else {
        const embed1 = new EmbedBuilder()
            .setColor("Green")
            .setDescription("✅ Unlocking the server...");
        await interaction.reply({ embeds: [embed1] });
        await Lockdown.findOneAndDelete({ Guild: interaction.guild.id });
        const textchannels = interaction.guild.channels.cache.filter(
          (c) => c.type === ChannelType.GuildText
        );
        const voicechannels = interaction.guild.channels.cache.filter(
          (c) => c.type === ChannelType.GuildVoice
        );
        textchannels.forEach(async (channel) => {
          await channel.permissionOverwrites.edit(
            interaction.guild.roles.everyone,
            {
              SendMessages: true,
            } 
          );
        });
        voicechannels.forEach(async (channel) => {
          await channel.permissionOverwrites.edit(
            interaction.guild.roles.everyone,
            {
              Connect: true,
            }
          );
        });
        const embed2 = new EmbedBuilder()
          .setColor("Green")
          .setDescription("✅Lockdown is lifted!")
          .setFooter({text: "Please be prepared to fix some channel permissions that may have been unwantedly changed"})
        return await interaction.editReply({ embeds: [embed2] });
      }
    }
  },
};
