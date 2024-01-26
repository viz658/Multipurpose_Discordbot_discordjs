const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    EmbedBuilder,
} = require('discord.js');
const Parser = require('rss-parser');
const parser = new Parser();
const NotificationConfig = require('../../schemas/NotificationConfig.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('yt-setup')
    .setDescription('Setup YouTube notifications for a channel.')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
        option
            .setName('youtube-id')
            .setDescription('The ID of the YouTube channel.')
            .setRequired(true)
    )
    .addChannelOption((option) =>
        option
            .setName('target-channel')
            .setDescription('The channel to get notifications in')
            .addChannelTypes(
                ChannelType.GuildText,
                ChannelType.GuildAnnouncement
            )
            .setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName('custom-message')
            .setDescription(
                'Templates: {VIDEO_TITLE} {VIDEO_URL} {CHANNEL_NAME} {CHANNEL_URL}'
            )
    ),
    category: 'moderation',
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });
    
            const targetYtChannelId = interaction.options.getString('youtube-id');
            const targetNotificationChannel =
                interaction.options.getChannel('target-channel');
            const targetCustomMessage =
                interaction.options.getString('custom-message');
    
            const duplicateExists = await NotificationConfig.exists({
                notificationChannelId: targetNotificationChannel.id,
                ytChannelId: targetYtChannelId,
            });
    
            if (duplicateExists) {
                interaction.followUp(
                    'That YouTube channel has already been configured for that text channel.\nRun `/notification-remove` first.'
                );
                return;
            }
    
            const YOUTUBE_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${targetYtChannelId}`;
    
            const feed = await parser.parseURL(YOUTUBE_RSS_URL).catch((e) => {
                interaction.followUp(
                    'There was an error fetching the channel. Ensure the ID is correct.'
                );
            });
    
            if (!feed) return;
    
            const channelName = feed.title;
    
            const notificationConfig = new NotificationConfig({
                guildId: interaction.guildId,
                notificationChannelId: targetNotificationChannel.id,
                ytChannelId: targetYtChannelId,
                customMessage: targetCustomMessage,
                lastChecked: new Date(),
                lastCheckedVid: null,
            });
    
            if (feed.items.length) {
                const latestVideo = feed.items[0];
    
                notificationConfig.lastCheckedVid = {
                    id: latestVideo.id.split(':')[2],
                    pubDate: latestVideo.pubDate,
                };
            }
    
            notificationConfig
                .save()
                .then(() => {
                    const embed = new EmbedBuilder()
                        .setTitle('✅ YouTube Channel Configuration Success!')
                        .setDescription(
                            `${targetNotificationChannel} will now get notified whenever there's a new upload by ${channelName}`
                        )
                        .setTimestamp();
    
                    interaction.followUp({ embeds: [embed] });
                })
                .catch((e) => {
                    interaction.followUp(
                        'Unexpected database error. Please try again in a moment.'
                    );
                });
        } catch (error) {
            console.log(`Error in ${__filename}:\n`, error);
        }
    }
}