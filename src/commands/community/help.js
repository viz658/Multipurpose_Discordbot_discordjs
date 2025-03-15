const {
	SlashCommandBuilder,
	EmbedBuilder,
	ActionRowBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('help command'),
	category: 'community',
	async execute(interaction, client) {
		const communityCommands = client.commands.filter(
			(command) => command.category === 'community'
		);
		const moderationCommands = client.commands.filter(
			(command) => command.category === 'moderation'
		);
		const applicationCommands = client.commands.filter(
			(command) => command.category === 'applications'
		);
		const economyCommands = client.commands.filter(
			(command) => command.category === 'economy'
		);
		const gameCommands = client.commands.filter(
			(command) => command.category === 'games'
		);
		const musicCommands = client.commands.filter(
			(command) => command.category === 'music'
		);

		const embed = new EmbedBuilder()
			.setColor('Blue')
			.setTitle('🆘 Help & resources')
			.setDescription(
				'Use the following menu to navigate through the command categories'
			)
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter({
				iconURL: client.user.displayAvatarURL(),
				text: client.user.tag,
			})
			.addFields({
				name: 'Add VizsGuard',
				value:
					'[Add VizsGuard to your server](https://discord.com/api/oauth2/authorize?client_id=1194418694873419806&permissions=8&scope=bot)',
			})
			.addFields({
				name: 'Support Server',
				value: '[Join the support server](https://discord.gg/MNYPqaH9Wv)',
			});
		const embed2 = new EmbedBuilder()
			.setColor('Blue')
			.setTitle('🫂 Community Commands')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter({
				iconURL: client.user.displayAvatarURL(),
				text: client.user.tag,
			});
		let description2 = '';
		communityCommands.forEach((command) => {
			if (command.data.description) {
				description2 += `/**${command.data.name}** - ${command.data.description}\n`;
			}
		});
		embed2.setDescription(description2);

		const embed3 = new EmbedBuilder()
			.setColor('Blue')
			.setTitle('👀 Moderation Commands')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter({
				iconURL: client.user.displayAvatarURL(),
				text: client.user.tag,
			});
		let description3 = '';
		moderationCommands.forEach((command) => {
			if (command.data.description) {
				description3 += `**/${command.data.name}** - ${command.data.description}\n`;
			}
		});
		embed3.setDescription(description3);

		const embed4 = new EmbedBuilder()
			.setColor('Blue')
			.setTitle('📲 Application Commands')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter({
				iconURL: client.user.displayAvatarURL(),
				text: client.user.tag,
			});
		let description4 = '';
		applicationCommands.forEach((command) => {
			if (command.description) {
				description4 += `**/${command.data.name}** - ${command.description}\n`;
			} else {
				description4 += `**/${command.data.name}** -\n`;
			}
		});
		embed4.setDescription(description4);

		const embed5 = new EmbedBuilder()
			.setColor('Blue')
			.setTitle('💵 Economy Commands')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter({
				iconURL: client.user.displayAvatarURL(),
				text: client.user.tag,
			});
		let description5 = '';
		economyCommands.forEach((command) => {
			if (command.data.description) {
				description5 += `**/${command.data.name}** - ${command.data.description}\n`;
			} else {
				description5 += `**/${command.data.name}** - No description\n`;
			}
		});
		embed5.setDescription(description5);

		const embed6 = new EmbedBuilder()
			.setColor('Blue')
			.setTitle('🎮 Game Commands')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter({
				iconURL: client.user.displayAvatarURL(),
				text: client.user.tag,
			});
		let description6 = '';
		gameCommands.forEach((command) => {
			if (command.data.description) {
				description6 += `**/${command.data.name}** - ${command.data.description}\n`;
			} else {
				description6 += `**/${command.data.name}** - No description\n`;
			}
		});
		embed6.setDescription(description6);

		const embed7 = new EmbedBuilder()
			.setColor('Blue')
			.setTitle('🎵 Music Commands')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter({
				iconURL: client.user.displayAvatarURL(),
				text: client.user.tag,
			});
		let description7 = '';
		musicCommands.forEach((command) => {
			description7 += `**/${command.data.name}** - ${command.data.description}\n Use button components to control the music player.`;
		});
		embed7.setDescription(description7);
		embed7.addFields({ name: 'Buttons:', value: ' ' });
		embed7.addFields({ name: '⏸️ Pause', value: 'Pause song' });
		embed7.addFields({ name: '▶️ Resume', value: 'Resume song' });
		embed7.addFields({ name: '➡️ Skip', value: 'Skip to queued song' });
		embed7.addFields({ name: '🛑 Stop', value: 'Stops music' });
		embed7.addFields({ name: '🔊 Volume Up', value: 'Increase volume' });
		embed7.addFields({ name: '🔉 Volume Down', value: 'Decrease volume' });
		embed7.addFields({ name: '🔀 Shuffle', value: 'Shuffle queue' });
		embed7.addFields({ name: '🔁 Repeat', value: 'Repeat song' });
		embed7.setFooter({
			text: 'Thank you to typedrago for sharing his music card code!',
		});

		const menu = new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder()
				.setCustomId('helpselect')
				.setPlaceholder('Select a command category')
				.addOptions(
					new StringSelectMenuOptionBuilder()
						.setLabel('🫂 Community Commands')
						.setValue('Community Commands'),
					new StringSelectMenuOptionBuilder()
						.setLabel('👀 Moderation Commands')
						.setValue('Moderation Commands'),
					new StringSelectMenuOptionBuilder()
						.setLabel('📲 Application Commands')
						.setValue('Application Commands'),
					new StringSelectMenuOptionBuilder()
						.setLabel('💵 Economy Commands')
						.setValue('Economy Commands'),
					new StringSelectMenuOptionBuilder()
						.setLabel('🎮 Game Commands')
						.setValue('Game Commands'),
					new StringSelectMenuOptionBuilder()
						.setLabel('🆘 Help & resources')
						.setValue('Help & resources'),
					new StringSelectMenuOptionBuilder()
						.setLabel('🎵 Music')
						.setValue('Music')
				)
		);
		const message = await interaction.reply({
			embeds: [embed],
			components: [menu],
		});
		const collector = message.createMessageComponentCollector();

		let deleteTimeout;
		collector.on('collect', async (i) => {
			if (!i.isStringSelectMenu()) return;
			if (i.customId !== 'helpselect') return;

			clearTimeout(deleteTimeout);
			deleteTimeout = setTimeout(() => {
				message.delete();
			}, 30000); //300000 = 5 minutes of inactivity

			if (i.values[0] === 'Help & resources') {
				if (i.user.id !== interaction.user.id) {
					return await i.reply({
						content: `Only ${interaction.user.username} can use this`,
						ephemeral: true,
					});
				}
				await i.update({ embeds: [embed], components: [menu] });
			}
			if (i.values[0] === 'Community Commands') {
				if (i.user.id !== interaction.user.id) {
					return await i.reply({
						content: `Only ${interaction.user.username} can use this`,
						ephemeral: true,
					});
				}
				await i.update({ embeds: [embed2], components: [menu] });
			}
			if (i.values[0] === 'Moderation Commands') {
				if (i.user.id !== interaction.user.id) {
					return await i.reply({
						content: `Only ${interaction.user.username} can use this`,
						ephemeral: true,
					});
				}
				await i.update({ embeds: [embed3], components: [menu] });
			}
			if (i.values[0] === 'Application Commands') {
				if (i.user.id !== interaction.user.id) {
					return await i.reply({
						content: `Only ${interaction.user.username} can use this`,
						ephemeral: true,
					});
				}
				await i.update({ embeds: [embed4], components: [menu] });
			}
			if (i.values[0] === 'Economy Commands') {
				if (i.user.id !== interaction.user.id) {
					return await i.reply({
						content: `Only ${interaction.user.username} can use this`,
						ephemeral: true,
					});
				}
				await i.update({ embeds: [embed5], components: [menu] });
			}
			if (i.values[0] === 'Game Commands') {
				if (i.user.id !== interaction.user.id) {
					return await i.reply({
						content: `Only ${interaction.user.username} can use this`,
						ephemeral: true,
					});
				}
				await i.update({ embeds: [embed6], components: [menu] });
			}
			if (i.values[0] === 'Music') {
				if (i.user.id !== interaction.user.id) {
					return await i.reply({
						content: `Only ${interaction.user.username} can use this`,
						ephemeral: true,
					});
				}
				await i.update({ embeds: [embed7], components: [menu] });
			}
		});
    deleteTimeout = setTimeout(() => {
      message.delete();
    }, 30000); //300000 = 5 minutes of inacvitiy
	},
};
