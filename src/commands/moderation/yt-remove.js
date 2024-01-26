const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
} = require('discord.js');

const NotificationConfig = require('../../schemas/NotificationConfig.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('yt-remove')
    .setDescription('Turn off YouTube notifications for a channel.')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
        option
            .setName('youtube-id')
            .setDescription('The ID of the target YouTube channel.')
            .setRequired(true)
    )
    .addChannelOption((option) =>
        option
            .setName('target-channel')
            .setDescription('The channel to turn off notifications for.')
            .addChannelTypes(
                ChannelType.GuildText,
                ChannelType.GuildAnnouncement
            )
            .setRequired(true)
    ),
    category: 'moderation',
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });
    
            const targetYtChannelId = interaction.options.getString('youtube-id');
            const targetNotificationChannel =
                interaction.options.getChannel('target-channel');
    
            const targetChannel = await NotificationConfig.findOne({
                ytChannelId: targetYtChannelId,
                notificationChannelId: targetNotificationChannel.id,
            });
    
            if (!targetChannel) {
                interaction.followUp(
                    'That YouTube channel has not been configured for notifications.'
                );
                return;
            }
    
            NotificationConfig.findOneAndDelete({ _id: targetChannel._id })
                .then(() => {
                    interaction.followUp(
                        'Turned off notifications for that channel!'
                    );
                })
                .catch((e) => {
                    interaction.followUp(
                        'There was a database error. Please try again in a moment.'
                    );
                });
        } catch (error) {
            console.log(`Error in ${__filename}:\n`, error);
        }
    }
}