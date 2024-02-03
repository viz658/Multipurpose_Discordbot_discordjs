const {
  ChatInputCommandInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} = require("discord.js");
const GuildConfiguration = require("../../schemas/GuildConfiguration");
const Suggestion = require("../../schemas/Suggestion");
const formatResults = require("../../functions/tools/formatResults");

/**
 *
 * @param {Object} param0
 * @param {ChatInputCommandInteraction} param0.interaction
 */

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Create a suggestion.")
    .setDMPermission(false),
  category: "community",

  async execute(interaction, client) {
    try {
      const guildConfiguration = await GuildConfiguration.findOne({
        guildId: interaction.guildId,
      });

      if (!guildConfiguration) {
        await interaction.reply({
          content:
            "This server has not been configured to use suggestions yet.\nAsk an admin to run `/config-suggestions add` to set this up.",
          ephemeral: true,
        });
        return;
      }
      //get suggestion channel so later can send the suggestion in that channel
      const suggestionChannel = interaction.guild.channels.cache.get(
        guildConfiguration.suggestionChannelId
      );

      // if (
      //   !guildConfiguration.suggestionChannelIds.includes(interaction.channelId)
      // ) {
      //   await interaction.reply(
      //     `This channel is not configured to use suggestions. Try one of these channels instead: ${guildConfiguration.suggestionChannelIds
      //       .map((id) => `<#${id}>`)
      //       .join(", ")}`
      //   );
      //   return;
      // }

      const modal = new ModalBuilder()
        .setTitle("Create a suggestion")
        .setCustomId(`suggestion-${interaction.user.id}`);

      const textInput = new TextInputBuilder()
        .setCustomId("suggestion-input")
        .setLabel("What would you like to suggest?")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(1000);

      const actionRow = new ActionRowBuilder().addComponents(textInput);

      modal.addComponents(actionRow);

      await interaction.showModal(modal);

      const filter = (i) => i.customId === `suggestion-${interaction.user.id}`;

      const modalInteraction = await interaction
        .awaitModalSubmit({
          filter,
          time: 1000 * 60 * 3,
        })
        .catch((error) => console.log(error));

      await modalInteraction.deferReply({ ephemeral: true });

      try {
        modalInteraction.editReply({
          content: "Creating suggestion, please wait...",
          ephemeral: true,
        });
      } catch (error) {
        modalInteraction.editReply({
          content:
            "Failed to create suggestion message in this channel. I may not have enough permissions.",
          ephemeral: true,
        });
        return;
      }

      const suggestionText =
        modalInteraction.fields.getTextInputValue("suggestion-input");

      const newSuggestion = new Suggestion({
        authorId: interaction.user.id,
        guildId: interaction.guildId,
        content: suggestionText,
      });

      await newSuggestion.save();

      modalInteraction.editReply("Suggestion created!");

      // Suggestion embed
      const suggestionEmbed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ size: 256 }),
        })
        .addFields([
          { name: "Suggestion", value: suggestionText },
          { name: "Status", value: "⏳ Pending" },
          { name: "Votes", value: formatResults() },
        ])
        .setColor("Yellow");

      // Buttons
      const upvoteButton = new ButtonBuilder()
        .setEmoji("👍")
        .setLabel("Upvote")
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`suggestion.${newSuggestion.suggestionId}.upvote`);

      const downvoteButton = new ButtonBuilder()
        .setEmoji("👎")
        .setLabel("Downvote")
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`suggestion.${newSuggestion.suggestionId}.downvote`);

      const approveButton = new ButtonBuilder()
        .setEmoji("✅")
        .setLabel("Approve")
        .setStyle(ButtonStyle.Success)
        .setCustomId(`suggestion.${newSuggestion.suggestionId}.approve`);

      const rejectButton = new ButtonBuilder()
        .setEmoji("🗑️")
        .setLabel("Reject")
        .setStyle(ButtonStyle.Danger)
        .setCustomId(`suggestion.${newSuggestion.suggestionId}.reject`);

      // Rows
      const firstRow = new ActionRowBuilder().addComponents(
        upvoteButton,
        downvoteButton
      );
      const secondRow = new ActionRowBuilder().addComponents(
        approveButton,
        rejectButton
      );
      //change messageid to message id where suggestion embed is sent

      const suggestionchannelmessage = await suggestionChannel.send({
        content: `${interaction.user} has created a suggestion!`,
        embeds: [suggestionEmbed],
        components: [firstRow, secondRow],
      });
      newSuggestion.messageId = suggestionchannelmessage.id;
      await newSuggestion.save();
    } catch (error) {
      console.error(error);
      console.log(`Error in /suggest: ${error}`);
    }
  },
};
