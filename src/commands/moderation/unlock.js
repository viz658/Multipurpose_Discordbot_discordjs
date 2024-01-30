const {
    SlashCommandBuilder,
    PermissionsBitField,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");

  module.exports = { 
    data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlock a channel after using /lock command on it")
    .setDMPermission(false)
    .addChannelOption((option) =>
      option
        .setDescription("The channel to unlock")
        .setName("channel")
    ),
    category: "moderation",
    async execute(interaction) {
        const channel = interaction.options.getChannel("channel") || interaction.channel;
        if (
            !interaction.member.permissions.has(
              PermissionsBitField.Flags.ManageChannels
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
          if (channel.type === ChannelType.GuildText) {
            await channel.permissionOverwrites.edit(
              interaction.guild.roles.everyone,
              {
                SendMessages: true,
              }
            );
            const embed = new EmbedBuilder()
              .setColor("Green")
              .setDescription(`✅ Unlocked ${channel}!`);
            await interaction.reply({ embeds: [embed] });
          } else if (channel.type === ChannelType.GuildVoice) {
            await channel.permissionOverwrites.edit(
              interaction.guild.roles.everyone,
              {
                Connect: true,
              }
            );
            const embed = new EmbedBuilder()
              .setColor("Green")
              .setDescription(`✅ Unlocked ${channel}!`);
            await interaction.reply({ embeds: [embed] });
          } else {
            const embed = new EmbedBuilder()
              .setColor("Red")
              .setDescription("⚠️This channel is not a text or voice channel!⚠️");
            await interaction.reply({ embeds: [embed] });
          }
    }
  }