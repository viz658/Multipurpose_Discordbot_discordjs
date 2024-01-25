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

    
    //   interaction.client.on('guildMemberRemove', async member => {
    //     // Fetch invites before member left
    //     const invitesBefore = await member.guild.invites.fetch();
  
    //     // Wait for Discord to update the invite count
    //     await new Promise(resolve => setTimeout(resolve, 1000));
  
    //     // Fetch invites after member left
    //     const invitesAfter = await member.guild.invites.fetch();
  
    //     // Find the invite which has one use less than before
    //     const usedInvite = invitesBefore.find(inv => {
    //       const after = invitesAfter.get(inv.code);
    //       return after && after.uses < inv.uses;
    //     });
  
    //     if (!usedInvite) {
    //       console.log(`Could not determine who invited ${member.user.tag}`);
    //       return;
    //     }
  
    //     // Fetch the member who created the used invite
    //     const inviter = await member.guild.members.fetch(usedInvite.inviter.id);
  
    //     // Subtract one invite from the inviter's count
    //     // This assumes you have a method to get and set a member's invite count
    //     const inviteCount = await getInviteCount(inviter);
    //     await setInviteCount(inviter, inviteCount - 1);
  
    //     console.log(`Subtracted one invite from ${inviter.user.tag}`);
    //   });
  },
};
