const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const currencySchema = require("../../schemas/customCurrency.js");
const Balance = require("../../schemas/balance");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("arrest")
    .setDescription("arrest a user.")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to imprison.")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("bail")
        .setDescription("The cost to bail the user out of jail.")
        .setRequired(false)
    ),
  category: "economy",
  async execute(interaction, client) {
    let emoji = "<:1887_Jail_pepe:1203964036874764308>";
    let currdata = await currencySchema.findOne({
      Guild: interaction.guild.id,
    });
    let currency = currdata ? currdata.Currency : "$";
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "⚠️You do not have the required permissions to use this command.⚠️"
        );
      return await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
    const user = interaction.options.getUser("user");
    const userBalance = await client.fetchBalance(
      user.id,
      interaction.guild.id
    );
    if (userBalance.inJail) {
      return await interaction.reply({
        content: "This user is already in jail!",
        ephemeral: true,
      });
    }
    let bail;
    if (interaction.options.getNumber("bail")) {
      bail = interaction.options.getNumber("bail");
    } else {
      bail = userBalance.bailcost;
    }
    if (interaction.options.getNumber("bail") < 1000 && interaction.options.getNumber("bail") !== null) {
      return await interaction.reply({
        content: `The minimum bail cost is ${currency} 1000`,
        ephemeral: true,
      });
    }
    await Balance.findOneAndUpdate(
      {
        _id: userBalance._id,
      },
      {
        inJail: true,
        bailcost: bail,
      }
    );
    const embed = new EmbedBuilder()
      .setColor("Red")
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setDescription(
        `🚓 ${user.tag} has been arrested and sent to jail! ${emoji} \n Their bail is set to ${currency} ${bail}`
      )
      .setFooter({
        text: "They are now unable to use economy commands.",
        iconURL: client.user.displayAvatarURL(),
      });
    if (interaction.guild.iconURL()) {
      embed.setThumbnail(interaction.guild.iconURL());
    }
    await interaction.reply({
      embeds: [embed],
    });
  },
};
