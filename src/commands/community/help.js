const { SlashCommandBuilder } = require("discord.js");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("dynamic help command"),
  category: "community",
  async execute(interaction, client) {
    const communityCommands = client.commands.filter(
      (command) => command.category === "community"
    );
    const moderationCommands = client.commands.filter(
      (command) => command.category === "moderation"
    );
    const applicationCommands = client.commands.filter(
      (command) => command.category === "applications"
    );
    const economyCommands = client.commands.filter(
      (command) => command.category === "economy"
    );
    const gameCommands = client.commands.filter(
      (command) => command.category === "games"
    );

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("Help & resources")
      .setDescription("Commands help")
      .setThumbnail(client.user.displayAvatarURL())
      .setTimestamp(Date.now())
      .setFooter({
        iconURL: client.user.displayAvatarURL(),
        text: client.user.tag,
      })
      .addFields({ name: "Page 1", value: "Help & resources" })
      .addFields({ name: "Page 2", value: "Community Commands" })
      .addFields({ name: "Page 3", value: "Moderation Commands" })
      .addFields({ name: "Page 4", value: "Application Commands" })
      .addFields({ name: "Page 5", value: "Economy Commands" })
      .addFields({ name: "Page 6", value: "Game Commands" })
      .addFields({
        name: "Add VizGuard",
        value:
          "[Add VizGuard to your server](https://discord.com/api/oauth2/authorize?client_id=1194418694873419806&permissions=8&scope=bot)",
      });
    const embed2 = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("Community Commands")
      .setThumbnail(client.user.displayAvatarURL())
      .setTimestamp(Date.now())
      .setFooter({
        iconURL: client.user.displayAvatarURL(),
        text: client.user.tag,
      });
    communityCommands.forEach((command) => {
      if (command.data.description) {
        embed2.addFields({
          name: `/${command.data.name}`,
          value: command.data.description,
        });
      }
    });

    const embed3 = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("Moderation Commands")
      .setThumbnail(client.user.displayAvatarURL())
      .setTimestamp(Date.now())
      .setFooter({
        iconURL: client.user.displayAvatarURL(),
        text: client.user.tag,
      });
    moderationCommands.forEach((command) => {
      if (command.data.description) {
        embed3.addFields({
          name: `/${command.data.name}`,
          value: command.data.description,
        });
      }
    });

    const embed4 = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("Application Commands")
      .setThumbnail(client.user.displayAvatarURL())
      .setTimestamp(Date.now())
      .setFooter({
        iconURL: client.user.displayAvatarURL(),
        text: client.user.tag,
      });
    applicationCommands.forEach((command) => {
      if (command.data.description) {
        embed4.addFields({
          name: `/${command.data.name}`,
          value: command.data.description,
        });
      } else {
        embed4.addFields({
          name: `/${command.data.name}`,
          value: "No description",
        });
      }
    });

    const embed5 = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("Economy Commands")
      .setThumbnail(client.user.displayAvatarURL())
      .setTimestamp(Date.now())
      .setFooter({
        iconURL: client.user.displayAvatarURL(),
        text: client.user.tag,
      });
    economyCommands.forEach((command) => {
      if (command.data.description) {
        embed5.addFields({
          name: `/${command.data.name}`,
          value: command.data.description,
        });
      } else {
        embed5.addFields({
          name: `/${command.data.name}`,
          value: "No description",
        });
      }
    });
    const embed6 = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("Game Commands")
      .setThumbnail(client.user.displayAvatarURL())
      .setTimestamp(Date.now())
      .setFooter({
        iconURL: client.user.displayAvatarURL(),
        text: client.user.tag,
      });
    gameCommands.forEach((command) => {
      if (command.data.description) {
        embed6.addFields({
          name: `/${command.data.name}`,
          value: command.data.description,
        });
      } else {
        embed6.addFields({
          name: `/${command.data.name}`,
          value: "No description",
        });
      }
    });

    const buttonRow1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("page1")
        .setLabel("Page 1")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("page2")
        .setLabel("Page 2")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("page3")
        .setLabel("Page 3")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("page4")
        .setLabel("Page 4")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("page5")
        .setLabel("Page 5")
        .setStyle(ButtonStyle.Success)
    );

    const buttonRow2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("page6")
        .setLabel("Page 6")
        .setStyle(ButtonStyle.Success)
    );

    const message = await interaction.reply({
      embeds: [embed],
      components: [buttonRow1, buttonRow2],
    });

    const collector = await message.createMessageComponentCollector();

    collector.on("collect", async (i) => {
      if (i.customId === "page1") {
        if (i.user.id !== interaction.user.id) {
          return await i.reply({
            content: `Only ${interaction.user.username} can use this button`,
            ephemeral: true,
          });
        }
        await i.update({
          embeds: [embed],
          components: [buttonRow1, buttonRow2],
        });
      }

      if (i.customId === "page2") {
        if (i.user.id !== interaction.user.id) {
          return await i.reply({
            content: `Only ${interaction.user.username} can use this button`,
            ephemeral: true,
          });
        }
        await i.update({
          embeds: [embed2],
          components: [buttonRow1, buttonRow2],
        });
      }

      if (i.customId === "page3") {
        if (i.user.id !== interaction.user.id) {
          return await i.reply({
            content: `Only ${interaction.user.username} can use this button`,
            ephemeral: true,
          });
        }
        await i.update({
          embeds: [embed3],
          components: [buttonRow1, buttonRow2],
        });
      }
      if (i.customId === "page4") {
        if (i.user.id !== interaction.user.id) {
          return await i.reply({
            content: `Only ${interaction.user.username} can use this button`,
            ephemeral: true,
          });
        }
        await i.update({
          embeds: [embed4],
          components: [buttonRow1, buttonRow2],
        });
      }
      if (i.customId === "page5") {
        if (i.user.id !== interaction.user.id) {
          return await i.reply({
            content: `Only ${interaction.user.username} can use this button`,
            ephemeral: true,
          });
        }
        await i.update({
          embeds: [embed5],
          components: [buttonRow1, buttonRow2],
        });
      }
      if (i.customId === "page6") {
        if (i.user.id !== interaction.user.id) {
          return await i.reply({
            content: `Only ${interaction.user.username} can use this button`,
            ephemeral: true,
          });
        }
        await i.update({
          embeds: [embed6],
          components: [buttonRow1, buttonRow2],
        });
      }
    });
  },
};
