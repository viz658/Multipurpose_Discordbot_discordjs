const { InteractionType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (!command) return;
      //blacklisted users
      let blacklistedusers = ["no user blacklisted yet"];
      if (blacklistedusers.includes(interaction.user.id)) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription("⚠️You are blacklisted from using this bot⚠️")
          .addFields({
            name: "Appeal here",
            value: "[Vizsguard Support server](https://discord.gg/MNYPqaH9Wv)",
          })
          .setFooter({
            text: "If you wish to appeal please join the support server and make a ticket.",
          });
        return await interaction.reply({ embeds: [embed], ephemeral: true });
      }
      //
      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "Something went wrong while executing this command...",
          ephemeral: true,
        });
      }
    } else if (interaction.isContextMenuCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const contextCommand = commands.get(commandName);
      if (!contextCommand) return;

      try {
        await contextCommand.execute(interaction, client);
      } catch (err) {
        console.error(err);
        await interaction.reply({
          content: "Something went wrong while executing this context menu...",
          ephemeral: true,
        });
      }
      // } else if (interaction.isButton()) {
      //   const { buttons } = client;
      //   const { customId } = interaction;
      //   const button = buttons.get(customId);
      //   if (!button) return;

      //   try {
      //     await button.execute(interaction, client);
      //   } catch (err) {
      //     console.error(err);
      //     await interaction.reply({
      //       content: "Something went wrong while executing this button...",
      //       ephemeral: true,
      //     });
      //   }
      // } else if (interaction.isStringSelectMenu()) {
      //   const { selectMenus } = client;
      //   const { customId } = interaction;
      //   const selectMenu = selectMenus.get(customId);
      //   if (!selectMenu) return;

      //   try {
      //     await selectMenu.execute(interaction, client);
      //   } catch (err) {
      //     console.error(err);
      //     await interaction.reply({
      //       content: "Something went wrong while executing this select menu...",
      //       ephemeral: true,
      //     });
      //   }
      // } else if (interaction.type == InteractionType.ModalSubmit) {
      //   const { modals } = client;
      //   const { customId } = interaction;
      //   const modal = modals.get(customId);
      //   if (!modal) return;

      //   try {
      //     await modal.execute(interaction, client);
      //   } catch (err) {
      //     console.error(err);
      //     await interaction.reply({
      //       content: "Something went wrong while executing this modal...",
      //       ephemeral: true,
      //     });
      //   }
      // } else if (interaction.isContextMenuCommand()) {
      //   const { commands } = client;
      //   const { commandName } = interaction;
      //   const contextCommand = commands.get(commandName);
      //   if (!contextCommand) return;

      //   try {
      //     await contextCommand.execute(interaction, client);
      //   } catch (err) {
      //     console.error(err);
      //     await interaction.reply({
      //       content: "Something went wrong while executing this context menu...",
      //       ephemeral: true,
      //     });
      //   }
      // } else if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
      //   const { commands } = client;
      //   const { commandName } = interaction;
      //   const command = commands.get(commandName);
      //   if (!command) return;

      //   try {
      //     await command.autocomplete(interaction, client);
      //   } catch (err) {
      //     console.error(err);
      //     await interaction.reply({
      //       content: "Something went wrong while executing this autocomplete...",
      //       ephemeral: true,
      //     });
      //   }
    }
  },
};
