const Autoroles = require('../../schemas/autoroles.js');
module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const role = await Autoroles.findOne({ GuildID: member.guild.id });
    const autorolegive = await member.guild.roles.cache.get(role.RoleID);

    member.roles.add(autorolegive);
  },
};
