const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Guild = require("../../schemas/guild.js");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Return some information about the server")
    .setDMPermission(false),
  category: "community",
  async execute(interaction, client) {
    let owner = await interaction.guild.fetchOwner();
    let fetchedMembers = await interaction.guild.members.fetch({
      withPresences: true,
    });
    let totalOnline = fetchedMembers.filter((member) =>
      ["online", "idle", "dnd"].includes(member.presence?.status)
    );
    let totalOnlineSize = totalOnline.size;
    let guildProfile = await Guild.findOne({
      guildId: interaction.guild.id,
      guildName: interaction.guild.name,
      guildIcon: interaction.guild.iconURL()
        ? interaction.guild.iconURL()
        : "None",
      guildCreationDate: interaction.guild.createdAt,
      guildMembers: interaction.guild.memberCount,
    });
    if (!guildProfile) {
      guildProfile = await new Guild({
        _id: new mongoose.Types.ObjectId(),
        guildId: interaction.guild.id,
        guildName: interaction.guild.name,
        guildIcon: interaction.guild.iconURL()
          ? interaction.guild.iconURL()
          : "None",
        guildCreationDate: interaction.guild.createdAt,
        guildMembers: interaction.guild.memberCount,
      });
      const embed = new EmbedBuilder()
        .setTitle("Server Info")
        .addFields({
          name: "Server Name",
          value: guildProfile.guildName,
        })
        .addFields({
          name: "Server Owner",
          value: `${owner}`,
        })
        .addFields({
          name: "Server Creation Date",
          value: guildProfile.guildCreationDate.toDateString(),
        })
        .addFields({
          name: "Server Members",
          value: `${guildProfile.guildMembers}`,
        })
        .addFields({
          name: "Total Online Members",
          value: `${totalOnlineSize}`,
        })
        .setFooter({ text: `Server ID: ${guildProfile.guildId}` })
        .setColor("Random");
      if (guildProfile.guildIcon !== "None") {
        embed.setThumbnail(guildProfile.guildIcon);
      }
      await guildProfile.save().catch(console.error);
      await interaction.reply({
        embeds: [embed],
      });
      console.log(guildProfile);
    } else {
      const embed = new EmbedBuilder()
        .setTitle("Server Info")
        .addFields({
          name: "Server Name",
          value: guildProfile.guildName,
        })
        .addFields({
          name: "Server Owner",
          value: `${owner}`,
        })
        .addFields({
          name: "Server Creation Date",
          value: guildProfile.guildCreationDate.toDateString(),
        })
        .addFields({
          name: "Server Members",
          value: `${guildProfile.guildMembers}`,
        })
        .addFields({
          name: "Total Online Members",
          value: `🟢 ${totalOnlineSize} members are online`,
        })
        .setFooter({ text: `Server ID: ${guildProfile.guildId}` })
        .setColor("Random");
      if (guildProfile.guildIcon !== "None") {
        embed.setThumbnail(guildProfile.guildIcon);
      }
      await interaction.reply({
        embeds: [embed],
      });
    }
  },
};
