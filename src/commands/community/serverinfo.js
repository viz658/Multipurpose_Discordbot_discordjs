const { SlashCommandBuilder, EmbedBuilder, ChannelType} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('server-info')
    .setDMPermission(false)
    .setDescription('View server info'),
    category: 'community',
    async execute(interaction) {

        const { guild } = interaction;
        const { members, stickers, role } = guild;
        const { name, ownerId, createdTimestamp, memberCount } = guild;
        const icon = guild.iconURL();
        const roles = guild.roles.cache.size;
        const emojis = guild.emojis.cache.size;
        const id = guild.id;
        const channels = interaction.guild.channels.cache.size;
        const category = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildCategory).size
        const text = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildText).size
        const voice = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildVoice).size
        const annnouncement = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildAnnouncement).size
        const stage = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildStageVoice).size
        const forum = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildForum).size
        const thread = interaction.guild.channels.cache.filter((c) => c.type === ChannelType.GuildPublicThread).size
        //const rolelist = guild.roles.cache.toJSON().join(' ')
        const botCount = members.cache.filter(member => member.user.bot).size
        const vanity = guild.vanityURLCode || 'No vanity'
        const sticker = stickers.cache.size
        const highestrole = interaction.guild.roles.highest
        const animated = interaction.guild.emojis.cache.filter(emoji => emoji.animated).size
        const description = interaction.guild.description || 'No description'

        const splitPascal = (string, separator) => string.split(/(?=[A-Z])/).join(separator);
        const toPascalCase = (string, separator = false) => {
            const pascal = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
            return separator ? splitPascal(pascal, separator) : pascal;
        };
        const features = guild.features?.map(feature => `- ${toPascalCase(feature, " ")}`)?.join("\n") || "None"

        let baseVerification = guild.verificationLevel;
 
        if (baseVerification == 0) baseVerification = "None"
        if (baseVerification == 1) baseVerification = "Low"
        if (baseVerification == 2) baseVerification = "Medium"
        if (baseVerification == 3) baseVerification = "High"
        if (baseVerification == 4) baseVerification = "Very High"
 
        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setThumbnail(icon)
        .setAuthor({ name: name, iconURL: icon })
        .setDescription(`${description}`)
        .setFooter({ text: `ID: ${id}`})
        .setTimestamp()
        .addFields({ name: "» Created", value: `<t:${parseInt(createdTimestamp / 1000 )}:R>`, inline: true})
        .addFields({ name: "» Owner", value: `<@${ownerId}>`, inline: true})
        .addFields({ name: "» Vanity URL", value: `${vanity}`, inline: true})
        .addFields({ name: "» Memberst", value: `${memberCount - botCount}`, inline: true})
        .addFields({ name: "» Bots", value: `${botCount}`, inline: true})
        .addFields({ name: "» Emojis", value: `${emojis}`, inline: true})
        .addFields({ name: "» Animated Emojis", value: `${animated}`, inline: true})
        .addFields({ name: "» Stickers", value: `${sticker}`, inline: true})
        .addFields({ name: `» Roles`, value: `${roles}`, inline: true})
        .addFields({ name: `» Highest Role`, value: `${highestrole}`, inline: true})
        .addFields({ name: "» Verification Level", value: `${baseVerification}`, inline: true})
        .addFields({ name: "» Boosts", value: `${guild.premiumSubscriptionCount}`, inline: true})
        .addFields({ name: "» Channels", value: `Total: ${channels} | Categories: ${category} | Text:  ${text} | Voice: ${voice} | Announcements: ${annnouncement} | Stages: | ${stage} | Forums: ${forum} | Threads: ${thread}`, inline: false})
        .addFields({ name: `» Features`, value: `\`\`\`${features}\`\`\``})
    

        await interaction.reply({ embeds: [embed], ephemeral: true});

    }
}