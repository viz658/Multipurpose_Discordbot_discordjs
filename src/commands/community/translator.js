const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const translate = require("@iamtraction/google-translate");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Translate a text to another language")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("Text to translate")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("lang")
        .setDescription("Language to translate to")
        .addChoices(
          { name: "English", value: "en " },
          { name: "Spanish", value: "es" },
          { name: "French", value: "fr" },
          { name: "German", value: "de" },
          { name: "Italian", value: "it" },
          { name: "Japanese", value: "ja" },
          { name: "Korean", value: "ko" },
          { name: "Portuguese", value: "pt" },
          { name: "Russian", value: "ru" },
          { name: "Chinese (Simplified)", value: "zh-CN" },
          { name: "Chinese (Traditional)", value: "zh-TW" },
          { name: "Arabic", value: "ar" },
          { name: "Latin", value: "la" },
          { name: "Greek", value: "gl" }
        )
        .setRequired(true)
    ),
  category: "community",
  async execute(interaction) {
    const { options } = interaction;
    const text = options.getString("text");
    const lang = options.getString("lang");

    await interaction.reply({ content: "Translating...", ephemeral: true})

    const applied = await translate(text, { to: `${lang}` });

    const embed = new EmbedBuilder()
      .setTitle("Translator")
      .setDescription(`Translated from ${applied.from.language.iso} to ${lang}`)
      .setColor("Random")
      .addFields({ name: "Text", value: `\`\`\`${text}\`\`\``, inline: false })
      .addFields({
        name: "Translated text:",
        value: `\`\`\`${applied.text}\`\`\``,
        inline: false,
      })
      .setFooter({ text: 
        `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL()}
      )
      .setTimestamp();

    await interaction.editReply({ embeds: [embed], ephemeral: true});
  },
};
