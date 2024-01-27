const {
  InteractionType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionFlagsBits
} = require("discord.js");
const ticketSchema = require("../../schemas/tickets.js");
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.type == InteractionType.ModalSubmit) {
      if (interaction.customId == "ticketmodal") {
        const data = await ticketSchema.findOne({
          Guild: interaction.guild.id,
        });
        const emailInput = interaction.fields.getTextInputValue("email");
        const userInput = interaction.fields.getTextInputValue("user");
        const reasonInput = interaction.fields.getTextInputValue("reason");

        const posChannel = await interaction.guild.channels.cache.find(
          (c) => c.name === `ticket-${interaction.user.id}`
        );
        if (posChannel) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `⚠️You already have a ticket open. - ${posChannel} ⚠️`
            );
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const category = data.Channel;
        const embed = new EmbedBuilder()
          .setColor("Random")
          .setTitle(`${interaction.user.username}'s Ticket`)
          .setDescription(
            "Welcome to your ticket. Wait for a staff member to respond."
          )
          .setTimestamp()
          .addFields({ name: `Email`, value: `${emailInput}` })
          .addFields({ name: `User`, value: `${userInput}` })
          .addFields({ name: `Reason`, value: `${reasonInput}` })
          .addFields({ name: `Type`, value: `${data.Ticket}` })
          .setFooter({ text: `${interaction.guild.name} tickets` });

        const button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("close-ticket")
            .setLabel("🗑️ Close Ticket")
            .setStyle(ButtonStyle.Danger)
        );

        let channel = await interaction.guild.channels.create({
          name: `ticket-${interaction.user.id}`,
          type: ChannelType.GuildText,
          parent: `${category}`,
          permissionOverwrites:[
            {
                id: interaction.guild.roles.everyone,
                deny: [PermissionFlagsBits.ViewChannel]
            },
            {
                id: interaction.user.id,
                allow: [PermissionFlagsBits.ViewChannel]
            },
            {
                id: client.user.id,
                allow: [PermissionFlagsBits.ViewChannel]
            }
          ]
        });

        let msg = await channel.send({
          embeds: [embed],
          components: [button],
        });
        await interaction.reply({
          content: `Your ticket has been created in - ${channel}`,
          ephemeral: true,
        });

        const collector = msg.createMessageComponentCollector();

        collector.on("collect", async (i) => {
          (await channel).delete();
          const dmembed = new EmbedBuilder()
            .setColor("Random")
            .setTitle(`Your Ticket has been closed`)
            .setDescription(
              "Thanks for contacting support. If you need anything else, feel free to open another ticket."
            )
            .setFooter({ text: `${interaction.guild.name} tickets` })
            .setTimestamp();
          await interaction.user.send({ embeds: [dmembed] }).catch((err) => {
            return;
          });
        });
      }
    }
  },
};
