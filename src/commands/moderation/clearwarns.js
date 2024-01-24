const {
    SlashCommandBuilder,
    EmbedBuilder,
  } = require("discord.js");
  const warningSchema = require("../../schemas/warns");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("clearwarns")
      .setDescription("Clear warnings on an user")
      .addUserOption((option) =>
        option
          .setName("target")
          .setDescription("The user you'd like to get warning info on")
          .setRequired(true)
      ),
    category: "moderation",
    async execute(interaction, client) {
      const target = interaction.options.getUser("target");
      const embed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(`✅ Cleared all warnings for ${target.tag}`);
      const noWarns = new EmbedBuilder()
      .setColor("Green")
      .setDescription("This user has no warnings!");
      warningSchema.findOne(
        { GuildID: interaction.guild.id, UserID: target.id, Usertag: target.tag },
        async (err, data) => {
          if (err) throw err;
          if (data) {
            await warningSchema.findOneAndDelete(
              { GuildID: interaction.guild.id, UserID: target.id, Usertag: target.tag },
            );
            return await interaction.reply({ embeds: [embed] });
          } else {
              return await interaction.reply({ embeds: [noWarns] });
          }
        }
      );

    },
  };
  