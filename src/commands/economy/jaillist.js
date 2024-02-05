const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("jail-list")
    .setDescription("View the list of users in jail.")
    .setDMPermission(false),
  category: "economy",
  async execute(interaction, client) {
    var members = await interaction.guild.members.fetch();
    var guildBalances = await Promise.all(
      members.map(async (member) => {
        const user = await client.fetchBalance(member.id, interaction.guild.id);
        return {
          user: member.user.id,
          inJail: user.inJail,
        };
      })
    );
    let string = "";
    var num = 1;
    for (const value of guildBalances) {
      if (value.inJail) {
        var member = await interaction.guild.members.fetch(value.user);
        string += `#${num} Member: ${member.user.tag}\n`;
        num++;
      }
    }
    const embed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(`🔒 **Users in Jail**\n\n${string}`)
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });
      if(interaction.guild.iconURL()) {
        embed.setThumbnail(interaction.guild.iconURL());
      }
    await interaction.reply({ embeds: [embed] });
  },
};
