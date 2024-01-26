const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Verification for discord server in a verification channel sends verification button in channel")
    .setDMPermission(false)
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The verified role")
        .setRequired(true)
    ),
  category: "moderation",
  async execute(interaction, client) {
    const { options } = interaction;
    const role = options.getRole("role");
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({
        content:
          "You do not have the required permissions to use this command.",
        ephemeral: true,
      });

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("button")
        .setEmoji("✅")
        .setLabel("Verify")
        .setStyle(ButtonStyle.Success)
    );

    const embed = new EmbedBuilder()
      .setTitle("Server Verification")
      .setDescription(
        "Click the button below to verify yourself for access to the server"
      )
      .setColor("Blue");

    await interaction.reply({ embeds: [embed], components: [button] });

    const collector =
      await interaction.channel.createMessageComponentCollector();
    collector.on("collect", async (i) => {
      await i.update({ embeds: [embed], components: [button] });
      const verifiedrole = interaction.guild.roles.cache.find(
        (r) => r.id === role.id
      );
      const member = i.member;
      member.roles.add(verifiedrole);

      await i.followUp({
        content: `You have been verified in the server!`,
        ephemeral: true,
      });
      
    });
  },
};
