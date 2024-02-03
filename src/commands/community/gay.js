const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gay")
    .setDescription("Gay test")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User you want to check gayness of")
        .setRequired(false)
    ),
    category: "community",
    async execute(interaction, client) {
        const user = interaction.options.getUser("user") || interaction.user;
        let gayness = Math.floor(Math.random() * 100);
        let emoji = "";
        
        if (gayness <= 10) emoji = "🤮";
        if (gayness > 10 && gayness <= 20) emoji = "🤢";
        if (gayness > 20 && gayness <= 30) emoji = "😡";
        if (gayness > 30 && gayness <= 40) emoji = "😠";
        if (gayness > 40 && gayness <= 50) emoji = "😐";
        if (gayness > 50 && gayness <= 60) emoji = "🌈";
        if (gayness > 60 && gayness <= 70) emoji = "😊";
        if (gayness > 70 && gayness <= 80) emoji = "😍";
        if (gayness > 80 && gayness <= 90) emoji = "🥰💅";
        if (gayness > 90 && gayness <= 100) emoji = "🏳️‍🌈🧚✨";
        const embed = new EmbedBuilder()
            .setTitle(`🌈 ${user.tag}'s gayness 🌈`)
            .setThumbnail(user.displayAvatarURL({ dynamic: false }))
            .setDescription(`${user} is ${gayness}% gay ${emoji}`)
            .setColor("#ff69c8")
        await interaction.reply({ embeds: [embed] });
    }
};
