const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const nekoclient = require("nekos.life");
const neko = new nekoclient();
module.exports = {
  data: new SlashCommandBuilder()
    .setName("do")
    .setDescription("Perform an action on someone!")
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("hug")
        .setDescription("Hug someone!")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to hug.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("kiss")
        .setDescription("Kiss someone!")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to kiss.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("pat")
        .setDescription("Pat someone!")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to pat.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("cuddle")
        .setDescription("Cuddle someone!")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to cuddle.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("tickle")
        .setDescription("Tickle someone!")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to tickle.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("slap")
        .setDescription("Slap someone!")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to slap.")
            .setRequired(true)
        )
    ),
  category: "community",
  async execute(interaction) {
    const { options } = interaction;
    const sub = options.getSubcommand();
    const user = options.getUser("user");
    //check if user is a bot and if user is themselves
    if (user.bot) {
      return await interaction.reply({
        content: "You can't do that to a bot!",
        ephemeral: true,
      });
    }
    if (user.id === interaction.user.id) {
      return await interaction.reply({
        content: "You can't do that to yourself!",
        ephemeral: true,
      });
    }
    switch (sub) {
      case "hug":
        const hug = await neko.hug();
        const embed = new EmbedBuilder()
          .setTitle(`${interaction.user.username} hugged ${user.username}!`)
          .setImage(hug.url)
          .setColor("#f78fef")
          .setTimestamp();
        await interaction.reply({ embeds: [embed] });
        break;
      case "kiss":
        const kiss = await neko.kiss();
        const embed1 = new EmbedBuilder()
          .setTitle(`${interaction.user.username} kissed ${user.username}!`)
          .setImage(kiss.url)
          .setColor("#f78fef")
          .setTimestamp();
        await interaction.reply({ embeds: [embed1] });
        break;
      case "pat":
        const pat = await neko.pat();
        const embed2 = new EmbedBuilder()
          .setTitle(`${interaction.user.username} patted ${user.username}!`)
          .setImage(pat.url)
          .setColor("#f78fef")
          .setTimestamp();
        await interaction.reply({ embeds: [embed2] });
        break;
      case "cuddle":
        const cuddle = await neko.cuddle();
        const embed3 = new EmbedBuilder()
          .setTitle(`${interaction.user.username} cuddled ${user.username}!`)
          .setImage(cuddle.url)
          .setColor("#f78fef")
          .setTimestamp();
        await interaction.reply({ embeds: [embed3] });
        break;

      case "tickle":
        const tickle = await neko.tickle();
        const embed5 = new EmbedBuilder()
          .setTitle(`${interaction.user.username} tickled ${user.username}!`)
          .setImage(tickle.url)
          .setColor("#f78fef")
          .setTimestamp();
        await interaction.reply({ embeds: [embed5] });
        break;
      case "slap":
        const slap = await neko.slap();
        const embed6 = new EmbedBuilder()
          .setTitle(`${interaction.user.username} slapped ${user.username}!`)
          .setImage(slap.url)
          .setColor("#f78fef")
          .setTimestamp();
        await interaction.reply({ embeds: [embed6] });
        break;
    }
  },
};
