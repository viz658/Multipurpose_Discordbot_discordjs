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
  category: "moderation",
  async execute(interaction, client) {
    const target = interaction.options.getUser("target");
    const embed = new EmbedBuilder()
      .setTitle(`⚠️🚨Warnings for ${target.tag}🚨⚠️`)
      .setColor("Red");
    const noWarns = new EmbedBuilder()
      .setDescription("✅ This user has no warnings!")
      .setColor("Green");
    warningSchema.findOne(
      { GuildID: interaction.guild.id, UserID: target.id, Usertag: target.tag },
      async (err, data) => {
        if (err) throw err;
        if (data) {
          embed
            .setDescription(
              `✅ ${data.Content.length} warnings found for ${
                target.tag
              }: \n${data.Content.map(
                (w, i) =>
                `
                  **Warning**: ${i + 1} 
                  **Moderator**: ${w.ModeratorTag} 
                  **Reason**: ${w.Reason}
                `
              )}`
            )
            .join("-");

          return await interaction.reply({ embeds: [embed] });
        } else {
          return await interaction.reply({ embeds: [noWarns] });
        }
      }
    );
  },
};
