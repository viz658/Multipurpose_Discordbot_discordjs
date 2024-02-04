const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
  PermissionsBitField,
} = require("discord.js");
const antispamdetectSchema = require("../../schemas/antispamdetect.js");
const antispamsetupSchema = require("../../schemas/antispamsetup.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("antispam")
    .setDescription("Enable or disable the antispam system.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("enable")
        .setDescription("Enable the antispam system.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to send the antispam logs to.")
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("disable")
        .setDescription("Disable the antispam system.")
    ),
  category: "moderation",
  async execute(interaction,client) {
    const { options } = interaction;
    const subcommand = options.getSubcommand();
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "⚠️You do not have the required permissions to use this command!⚠️"
        );
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }
    let data = await antispamsetupSchema .findOne({
      Guild: interaction.guild.id,
    });

    async function sendMessage(message,color) {
      const embed = new EmbedBuilder().setColor(`${color}`).setDescription(message).setFooter({text: "🚨Warning this system is very punishing!🚨", iconURL: client.user.displayAvatarURL({dynamic: true})});

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    switch (subcommand) {
      case "enable":
        if (data) {
          await sendMessage("⚠️The antispam system is already enabled!⚠️", "Red");
        } else {
          const channel = options.getChannel("channel") || false;
          if (!channel) {
            await antispamsetupSchema .create({
              Guild: interaction.guild.id,
            });
          }
          else {
            await antispamsetupSchema .create({
              Guild: interaction.guild.id,
              Channel: channel.id,
            });
          }

          await sendMessage("✅The antispam system is now enabled!","Green");
        }
        break;
        case "disable":
            if (!data) {
                await sendMessage("⚠️The antispam system is already disabled!⚠️", "Red");
            } else {
                await antispamsetupSchema .deleteMany({
                Guild: interaction.guild.id,
                });
                await antispamdetectSchema.deleteMany({
                Guild: interaction.guild.id,
                });
                await sendMessage("✅The antispam system is now disabled!", "Green");
            }
            break;
    }
  },
};
