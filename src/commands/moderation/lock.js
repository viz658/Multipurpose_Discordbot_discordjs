const {
  SlashCommandBuilder,
  PermissionsBitField,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription(
      "Disable messages in a text channel or connect in a voice channel"
    )
    .setDMPermission(false)
    .addChannelOption((option) =>
      option
        .setDescription("The channel to lock")
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
              SendMessages: false,
            }
          );
          const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`✅ Locked ${channel}!`);
          await interaction.reply({ embeds: [embed] });
        } else if (channel.type === ChannelType.GuildVoice) {
          await channel.permissionOverwrites.edit(
            interaction.guild.roles.everyone,
            {
              Connect: false,
            }
          );
          const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`✅ Locked ${channel}!`);
          await interaction.reply({ embeds: [embed] });
        } else {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "⚠️You can only lock text and voice channels!⚠️"
            );
          await interaction.reply({ embeds: [embed] });
        }
    }

};
