const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invites")
    .setDescription("Show invites leaderboard"),
  category: "community",
  async execute(interaction, client) {
    var invites = await interaction.guild.invites.fetch();
    var members = await interaction.guild.members.fetch();

    async function total() {
      var userInvs = [];
      await members.forEach(async (member) => {
        var userInvites = await invites.filter(
          (u) => u.inviter && u.inviter.id === member.user.id
        );
        var count = 0;

        await userInvites.forEach(async (invite) => (count += invite.uses));
        userInvs.push({ user: member.user.id, invites: count });
      });
      return userInvs;
    }

    async function sendMessage(message) {
      const embed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(message);

      await interaction.reply({ embeds: [embed] });
    }

    var leaderboard = await total();
    leaderboard.sort((a, b) => b.invites - a.invites);
    var output = leaderboard.slice(0, 10);
    var string = ""; 
    var num = 1;

    for (const value of output) {
        var member = await interaction.guild.members.fetch(value.user);
        string += `#${num} Member: ${member.user} Invites: \`${value.invites}\`\n`;
        num++;
      }
      
      await sendMessage(` **Invite Leaderboard** \n\n${string}`);

    
  },
};
