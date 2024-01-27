const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  InteractionType,
} = require("discord.js");
const ticketSchema = require("../../schemas/tickets.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (interaction.isButton()) return;
    if (interaction.isChatInputCommand()) return;
    const modal = new ModalBuilder()
      .setTitle("Provide more information for your ticket")
      .setCustomId("ticketmodal");

    const email = new TextInputBuilder()
      .setCustomId("email")
      .setRequired(false)
      .setLabel("Your email (optional)")
      .setPlaceholder("Enter your email")
      .setStyle(TextInputStyle.Short);

    const user = new TextInputBuilder()
      .setCustomId("user")
      .setRequired(true)
      .setLabel("Your username")
      .setPlaceholder("Enter your username")
      .setStyle(TextInputStyle.Short);

    const reason = new TextInputBuilder()
      .setCustomId("reason")
      .setRequired(true)
      .setLabel("Provide us your reason for this ticket")
      .setPlaceholder("Enter your reason")
      .setStyle(TextInputStyle.Short);

    const actionRow1 = new ActionRowBuilder().addComponents(email);
    const actionRow2 = new ActionRowBuilder().addComponents(user);
    const actionRow3 = new ActionRowBuilder().addComponents(reason);

    modal.addComponents(actionRow1, actionRow2, actionRow3);

    let choices;
    if (interaction.isStringSelectMenu()) {
      choices = interaction.values;

      const result = choices.join("");

      const filter = { Guild: interaction.guild.id };
      const update = { Ticket: result };
      await ticketSchema
        .updateOne(filter, update, {
          new: true,
        })
        .then((value) => {
        });
    }

    if (interaction.type !== InteractionType.ModalSubmit) {
      await interaction.showModal(modal);
    }
  },
};
