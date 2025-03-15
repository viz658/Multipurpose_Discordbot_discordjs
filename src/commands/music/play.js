const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song or playlist.')
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName('query')
				.setDescription('Provide the name or url for the song.')
				.setMaxLength(1000)
				.setRequired(true)
		),
	category: 'music',
	async execute(interaction, client) {
		await interaction.deferReply();
		const { options, member, guild, channel } = interaction;

		const query = options.getString('query');
		const voiceChannel = member.voice.channel;

		const embed = new EmbedBuilder();

		if (!voiceChannel) {
			embed
				.setColor('Red')
				.setDescription(
					'⚠️You must be in a voice channel to execute music commands.⚠️'
				);
			return interaction.editReply({ embeds: [embed], ephemeral: true });
		}

		if (!member.voice.channelId == guild.members.me.voice.channelId) {
			embed
				.setColor('Red')
				.setDescription(
					`⚠️You can't use the music player as it is already active in <#${guild.members.me.voice.channelId}>⚠️`
				);
			return interaction.editReply({ embeds: [embed], ephemeral: true });
		}

		const queue = client.distube.getQueue(interaction.guildId);
		if (queue) {
			const isPlaying = queue.playing;

			try {
				await client.distube.play(voiceChannel, query, {
					textChannel: channel,
					member: member,
				});

				if (!isPlaying) {
					embed
						.setColor('Green')
						.setDescription(
							`🎶 | Request received. Joining <#${guild.members.me.voice.channelId}>`
						);
				} else if (isPlaying) {
					embed
						.setColor('Green')
						.setDescription(`🎶 | Request received. Added song to the queue.`);
				}

				return await interaction.editReply({
					embeds: [embed],
				});
			} catch (err) {
				if (err && err.errorCode === 'YTDLP_ERROR') {
					embed
						.setColor('Red')
						.setDescription('⚠️Failed to fetch song try again later.⚠️');
				} else if (err && err.errorCode === 'NO_RESULT') {
					embed
						.setColor('Red')
						.setDescription(`⚠️No results found for **${query}**⚠️`);
				} else if (err && err.message.includes('Unknown Playlist')) {
					embed
						.setColor('Red')
						.setDescription(
							'⚠️Please make sure the playlist link is not private and exists.⚠️'
						);
				} else {
					console.error(err);
					console.error(err.errorCode);
					embed
						.setColor('Red')
						.setDescription(
							'⚠️An unexpected error occured. Please try again later.⚠️'
						);
				}
				return await interaction.editReply({ embeds: [embed] });
			}
		} else {
			try {
				await client.distube.play(voiceChannel, query, {
					textChannel: channel,
					member: member,
				});
				embed
					.setColor('Green')
					.setDescription(
						`🎶 | Request received. Joining <#${guild.members.me.voice.channelId}>`
					);
				return await interaction.editReply({ embeds: [embed] });
			} catch (err) {
				if (err && err.errorCode === 'YTDLP_ERROR') {
					embed
						.setColor('Red')
						.setDescription('⚠️Failed to fetch song try again later.⚠️');
				} else if (err && err.errorCode === 'NO_RESULT') {
					embed
						.setColor('Red')
						.setDescription(`⚠️No results found for **${query}**⚠️`);
				} else if (err && err.message.includes('Unknown Playlist')) {
					embed
						.setColor('Red')
						.setDescription(
							'⚠️Please make sure the playlist link is not private and exists.⚠️'
						);
				} else {
					console.error(err);
					console.error(err.errorCode);
					embed
						.setColor('Red')
						.setDescription(
							'⚠️An unexpected error occured. Please try again later.⚠️'
						);
				}
				return await interaction.editReply({ embeds: [embed] });
			}
		}
	},
};
