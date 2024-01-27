const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");
const warningSchema = require("../../schemas/warns");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a user")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user you'd like to warn")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the warning")
        .setRequired(false)
    ),
  category: "moderation",
  async execute(interaction, client) {
    const target = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason") || "";
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)
    ) {
      return await interaction.reply({
        content: "You don't have permission to use this command!",
        ephemeral: true,
      });
    }
    const targetTag = `${target.username}`;
    try {
      let data = await warningSchema.findOne({
        GuildID: interaction.guild.id,
        UserID: target.id,
        UserTag: targetTag,
      });

      if (!data) {
        data = new warningSchema({
          GuildID: interaction.guild.id,
          UserID: target.id,
          UserTag: targetTag,
          Content: [
            {
              Moderator: interaction.user.id,
              ModeratorTag: interaction.user.tag,
              Reason: reason,
            },
          ],
        });
      } else {
        const warnContent = {
          Moderator: interaction.user.id,
          ModeratorTag: interaction.user.tag,
          Reason: reason,
        };
        data.Content.push(warnContent);
      }

      await data.save();
    } catch (err) {
      console.error(err);
    }

    const embed1 = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription(
        `⚠️🚨 You have been **warned** in ${interaction.guild.name} ${
          reason ? " for " : ""
        } ${reason}`
      );
    const embed2 = new EmbedBuilder()
      .setColor("Blurple")
      .setDescription(
        `✅ **Warned** ${targetTag} ${reason ? " for " : ""} ${reason}`
      );
    target
      .send({
        embeds: [embed1],
      })
      .catch((err) => {
        console.log(err);
        interaction.reply({
          content: "I couldn't DM the user, but they have been warned!",
          ephemeral: true,
        });
      });
    interaction.reply({ embeds: [embed2], ephemeral: true});
  },
};
