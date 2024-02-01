const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const linkSchema = require("../../schemas/Antilinks.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("antilink")
    .setDescription("Anti-link system")
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("enable")
        .setDescription("Enable the anti-link system")
        .addStringOption((option) =>
          option
            .setName("perms")
            .setRequired(true)
            .setDescription("Perrmissions to bypass the anti-link system")
            .addChoices(
              { name: "Manage Channels", value: "ManageChannels" },
              { name: "Manage Messages", value: "ManageMessages" },
              { name: "Administrator", value: "Administrator" },
              { name: "Embed Links", value: "EmbedLinks" }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("disable")
        .setDescription("Disable the anti-link system")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("view")
        .setDescription("View the anti-link system settings")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("edit")
        .setDescription("Edit the anti-link system settings")
        .addStringOption((option) =>
          option
            .setName("perms")
            .setRequired(true)
            .setDescription("Perrmissions to bypass the anti-link system")
            .addChoices(
              { name: "Manage Channels", value: "ManageChannels" },
              { name: "Manage Messages", value: "ManageMessages" },
              { name: "Administrator", value: "Administrator" },
              { name: "Embed Links", value: "EmbedLinks" }
            )
        )
    ),
  category: "Moderation",
  async execute(interaction) {
    const { options } = interaction;
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      const embed = new EmbedBuilder()
        .setDescription(
          "⚠️You do not have the required permissions to use this command.⚠️"
        )
        .setColor("Red");
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }
    const sub = options.getSubcommand();

    switch (sub) {
      case "enable":
        const permissions = options.getString("perms");
        const Data = await linkSchema.findOne({ Guild: interaction.guild.id });
        if (Data) {
          const embed = new EmbedBuilder()
            .setDescription(
              "⚠️The anti-link system is already enabled on this server.⚠️"
            )
            .setColor("Red");
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        else {
            linkSchema.create({
                Guild: interaction.guild.id,
                Perms: permissions
            });
            const embed = new EmbedBuilder()
                .setDescription(
                    `✅The anti-link system has been enabled on this server. Bypass permissions: ${permissions}.`
                )
                .setColor("Green");
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
    switch (sub) {
        case "disable":
            await linkSchema.deleteMany();
            const embed = new EmbedBuilder()
                .setDescription(
                    `✅The anti-link system has been disabled.`
                )
                .setColor("Green");
            return await interaction.reply({ embeds: [embed], ephemeral: true });
    }
    switch (sub) {
        case "view":
            const data = await linkSchema.findOne({ Guild: interaction.guild.id });
            if (!data) {
                const embed = new EmbedBuilder()
                    .setDescription(
                        "⚠️The anti-link system is not enabled on this server.⚠️"
                    )
                    .setColor("Red");
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }
            const permissions = data.Perms;
            if(!permissions) {
                const embed = new EmbedBuilder()
                    .setDescription(
                        "⚠️The anti-link system is not enabled on this server.⚠️"
                    )
                    .setColor("Red");
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }
            else {
                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`Anti-link system settings for this server:\nBypass permissions: ${permissions}`);
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }
    }
    switch(sub) {
        case "edit":
            const data = await linkSchema.findOne({ Guild: interaction.guild.id });
            const permissions = options.getString("perms");
            if (!data) {
                const embed = new EmbedBuilder()
                    .setDescription(
                        "⚠️The anti-link system is not enabled on this server.⚠️"
                    )
                    .setColor("Red");
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
                await linkSchema.deleteMany();
                await linkSchema.create({
                    Guild: interaction.guild.id,
                    Perms: permissions
                });
                const embed = new EmbedBuilder()
                .setDescription(
                    `✅The anti-link system Bypass permissions are now: ${permissions}.`
                )
                .setColor("Green");
            return await interaction.reply({ embeds: [embed], ephemeral: true });
            }
    }
  },
};
