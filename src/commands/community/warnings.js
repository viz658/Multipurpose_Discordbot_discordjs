const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const warningSchema = require("../../schemas/warns");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("Get warnings on an user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user you'd like to get warning info on")
    ),
  category: "community",
  async execute(interaction, client) {
    const target = interaction.options.getUser("target") || interaction.user;
    const embed = new EmbedBuilder()
      .setTitle(`⚠️🚨Warnings for ${target.tag}🚨⚠️`)
      .setColor("Red");
    const noWarns = new EmbedBuilder()
      .setDescription("✅ This user has no warnings!")
      .setColor("Green");
      try {
        const data = await warningSchema.findOne({
          GuildID: interaction.guild.id,
          UserID: target.id,
          UserTag: target.tag,
        });
      
        if (data) {
          const warnings = data.Content.map(
            (w, i) =>
              `
                **Warning**: ${i + 1} 
                **Moderator**: ${w.ModeratorTag} 
                **Reason**: ${w.Reason}
              `
          ).join("-");
      
          embed.setDescription(
            `✅ ${data.Content.length} warnings found for ${target.tag}: \n${warnings}`
          );
      
          return await interaction.reply({ embeds: [embed] });
        } else {
          return await interaction.reply({ embeds: [noWarns] });
        }
      } catch (err) {
        console.error(err);
      }  
  },
};
