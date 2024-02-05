const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const linkSchema = require("../../schemas/Antilinks.js"); //antilink sys
const guildConfigurationSchema = require("../../schemas/GuildConfiguration"); //suggestions sys
const giveawaySchema = require("../../schemas/Giveaways.js"); //giveaway sys
const autorolesSchema = require("../../schemas/autoroles.js"); //autorole sys
const automodSchema = require("../../schemas/Automod.js"); //automod sys
const anitbotSchema = require("../../schemas/antibot.js"); //antibot sys
const lockdownSchema = require("../../schemas/Lockdown.js"); //lockdown sys
const modLogsSchema = require("../../schemas/Modlogs.js"); //modlogs sys
const notificationconfigSchema = require("../../schemas/NotificationConfig.js"); //yt notification sys
const reactionroleSchema = require("../../schemas/reactionrs.js"); //reactionrole sys
const ticketSchema = require("../../schemas/tickets.js"); //ticket sys
const welcomeSchema = require("../../schemas/WelcomeChannel.js"); //welcome sys
const antispamsetupSchema = require("../../schemas/antispamsetup.js"); //antispam sys
module.exports = {
  data: new SlashCommandBuilder()
    .setName("systemstatus")
    .setDMPermission(false)
    .setDescription("View the system status of your server"),
  category: "moderation",
  async execute(interaction, client) {
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
    const loading = new EmbedBuilder()
      .setDescription("🔃Retrieving system status...")
      .setColor("Blue");
    await interaction.reply({ embeds: [loading], ephemeral: true });
    
    // let online = "🟢";
    // let offline = "🔴";
    let online = "<a:onlineload:1203923619877486592>";
    let offline = "<a:offlineload:1203923676400193576>";
    let status1 = "";
    let status2 = "";
    let status3 = "";
    let status4 = "";
    let status5 = "";
    let status6 = "";
    let status7 = "";
    let status8 = "";
    let status9 = "";
    let status10 = "";
    let status11 = "";
    let status12 = "";
    let status13 = "";
    const antilinkdata = await linkSchema.findOne({
      Guild: interaction.guild.id,
    });
    const suggestionsdata = await guildConfigurationSchema.findOne({
      guildId: interaction.guild.id,
    });
    const giveawaydata = await giveawaySchema.findOne({
      guildId: interaction.guild.id,
    });
    const autorolesdata = await autorolesSchema.findOne({
      GuildID: interaction.guild.id,
    });
    const automoddata = await automodSchema.findOne({
      Guild: interaction.guild.id,
    });
    const antibotdata = await anitbotSchema.findOne({
      Guild: interaction.guild.id,
    });
    const lockdowndata = await lockdownSchema.findOne({
      Guild: interaction.guild.id,
    });
    const modlogsdata = await modLogsSchema.findOne({
      Guild: interaction.guild.id,
    });
    const notificationconfigdata = await notificationconfigSchema.findOne({
      guildId: interaction.guild.id,
    });
    const reactionroledata = await reactionroleSchema.findOne({
      Guild: interaction.guild.id,
    });
    const ticketdata = await ticketSchema.findOne({
      Guild: interaction.guild.id,
    });
    const welcomedata = await welcomeSchema.findOne({
      guildId: interaction.guild.id,
    });
    const antispamdata = await antispamsetupSchema.findOne({
      Guild: interaction.guild.id,
    });

    if (!antilinkdata) {
      status1 = offline;
    } else {
      status1 = online;
    }
    if (!suggestionsdata) {
      status2 = offline;
    } else {
      status2 = online;
    }
    if (!giveawaydata) {
      status3 = offline;
    } else {
      status3 = online;
    }
    if (!autorolesdata) {
      status4 = offline;
    } else {
      status4 = online;
    }
    if (!automoddata) {
      status5 = offline;
    } else {
      status5 = online;
    }
    if (!antibotdata) {
      status6 = offline;
    } else {
      status6 = online;
    }
    if (!lockdowndata) {
      status7 = offline;
    } else {
      status7 = online;
    }
    if (!modlogsdata) {
      status8 = offline;
    } else {
      status8 = online;
    }
    if (!notificationconfigdata) {
      status9 = offline;
    } else {
      status9 = online;
    }
    if (!reactionroledata) {
      status10 = offline;
    } else {
      status10 = online;
    }
    if (!ticketdata) {
      status11 = offline;
    } else {
      status11 = online;
    }
    if (!welcomedata) {
      status12 = offline;
    } else {
      status12 = online;
    }
    if (!antispamdata) {
      status13 = offline;
    } else {
      status13 = online;
    }
    const embed = new EmbedBuilder()
      .setTitle(`💻 ${interaction.guild.name} System Status`)
      .setDescription(
        `🔗 Antilink system: ${status1}\n 👍 Suggestions system: ${status2}\n 🎉 Giveaways system: ${status3}\n 📧 Autoroles system: ${status4}\n 🤖 Automod system: ${status5}\n 🤖☠️ Antibot system: ${status6}\n 🔒 Lockdown system: ${status7}\n 📨 Modlogs system: ${status8}\n ⏯️ YT Notification Config system: ${status9}\n 🗂️ Reaction Roles system: ${status10}\n 🎫 Tickets system: ${status11}\n 👋 Welcome system: ${status12} \n 📩 Antispam system ${status13}`
      )
      .setFooter({ text: "online = 🟢 | offline = 🔴" })
      .setAuthor({
        name: `${client.user.tag}`,
        iconURL: `${client.user.displayAvatarURL()}`,
      })
      .setColor("Blue")
      .setTimestamp();
    //check if guild has icon
    if (interaction.guild.icon) {
      embed.setThumbnail(interaction.guild.iconURL());
    } else {
      embed.setThumbnail(client.user.displayAvatarURL());
    }
    return await interaction.editReply({ embeds: [embed], ephemeral: true });
  },
};
