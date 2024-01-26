const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { Types } = require("mongoose");
const Autoroles = require('../../schemas/autoroles.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName("setautorole")
    .setDescription("Set the autorole for the server.")
    .setDMPermission(false)
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role you want to set to autorole.")
        .setRequired(true)
    ),
    category: "moderation",
    async execute(interaction, client) {
        const role = interaction.options.getRole("role");
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("⚠️You do not have administrator permission to use this command.⚠️")
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const data = await new Autoroles({
            _id:  new Types.ObjectId(),
            GuildID: interaction.guild.id,
            RoleID: role.id,
        });
        await data.save();

        const embed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(`✅Successfully set the role ${role} as autorole.`)
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}