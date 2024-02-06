const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("nsfw")
    .setNSFW(true)
    .setDescription("Look at nsfw content.")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("The category of nsfw content.")
        .setRequired(true)
        .addChoices(
          {
            name: "Porn gif",
            value: "pgif",
          },
          {
            name: "Anal",
            value: "anal",
          },
          {
            name: "Hentai Anal",
            value: "hanal",
          },
          {
            name: "Yaoi",
            value: "yaoi",
          },
          {
            name: "Ass",
            value: "ass",
          },
          {
            name: "Hentai Ass",
            value: "hass",
          },
          {
            name: "Boobs",
            value: "boobs",
          },
          {
            name: "Hentai boobs",
            value: "hboobs",
          },
          {
            name: "Pussy",
            value: "pussy",
          },
          {
            name: "Thighs",
            value: "thigh",
          }
        )
    ),
  category: "nsfw",
  async execute(interaction) {
    let category = interaction.options.getString("category");
    //let category = choice.value;
    const res = await fetch(`https://nekobot.xyz/api/image?type=${category}`);
    const json = await res.json();
    const embed = new EmbedBuilder()
      .setImage(json.message)
      .setColor("#f78fef")
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
