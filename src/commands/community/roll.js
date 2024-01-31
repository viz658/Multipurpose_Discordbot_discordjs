const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roll")
        .setDescription("Roll a dice")
        .setDMPermission(false),
    category: "community",
    async execute(interaction) {
        let roll = Math.floor(Math.random() * 6) + 1;
        let emoji = "";
        if (roll === 1) emoji = "1️⃣";
        if (roll === 2) emoji = "2️⃣";
        if (roll === 3) emoji = "3️⃣";
        if (roll === 4) emoji = "4️⃣";
        if (roll === 5) emoji = "5️⃣";
        if (roll === 6) emoji = "6️⃣";
        const embed = new EmbedBuilder()
            .setTitle("🎲 Dice Roll")
            .setDescription(`You rolled a ${emoji} `)
            .setColor("White")
        await interaction.reply({ embeds: [embed] });
    }
}