const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lovemeter")
    .setDescription("Find how much of a match two users are!")
    .setDMPermission(false)
    .addUserOption((option) =>
      option.setName("user1").setDescription("First user").setRequired(true)
    )
    .addUserOption((option) =>
      option.setName("user2").setDescription("Second user").setRequired(true)
    ),
    category: "community",
    async execute(interaction) {
        const user1 = interaction.options.getUser("user1");
        const user2 = interaction.options.getUser("user2");
        const love = Math.floor(Math.random() * 100);
        let emoji;
        if(love <= 50) emoji = "💔";
        if(love > 50 && love <= 60) emoji = "💖";
        if(love > 60 && love <= 70) emoji = "💗";
        if(love > 70 && love <= 80) emoji = "💘";
        if(love > 80 && love <= 90) emoji = "💝";
        if(love > 90 && love <= 100) emoji = "💞";
        const embed = new EmbedBuilder()
            .setColor("#ff69c8")
            .setTitle("😚Love Meter😚")
            .setDescription(`${emoji} **${user1}** and **${user2}** are **${love}%** compatible! ${emoji}`)
            .setTimestamp(Date.now())
            .setFooter({
                iconURL: interaction.user.displayAvatarURL(),
                text: interaction.user.tag,
            });
        interaction.reply({ embeds: [embed] });
    }
};
