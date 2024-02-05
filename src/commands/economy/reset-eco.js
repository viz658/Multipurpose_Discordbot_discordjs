const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reset-eco")
    .setDescription("Reset the economy of the server")
    .setDMPermission(false),
  category: "economy",
  async execute(interaction, client) {
    //check if user is also server owner
    if (interaction.user.id !== interaction.guild.ownerId) {
      return await interaction.reply({
        content: "Only the server owner can use this command!",
        ephemeral: true,
      });
    }
    const filter = (m) => m.author.id === interaction.user.id;
    await interaction.reply({
      content:
        "Are you sure you want to reset the bank and balances of this server? This action is irreversible! Type `yes` to confirm or `no` to cancel.",
      ephemeral: true,
    });
    const collector = interaction.channel.createMessageCollector({
      filter,
      time: 15000,
      max: 1,
    });
    collector.on("collect", async (m) => {
      if (m.content.toLowerCase() === "yes") {
        await client.resetEconomy(interaction.guild.id);
        await interaction.followUp({
          content: "The economy has been reset successfully!",
          ephemeral: true,
        });
      } else if (m.content.toLowerCase() === "no") {
        await interaction.followUp({
          content: "The economy reset has been cancelled!",
          ephemeral: true,
        });
      } else {
        await interaction.followUp({
          content: "Invalid response! The economy reset has been cancelled!",
          ephemeral: true,
        });
      }
    });
    collector.on("end", async (collected, reason) => {
      if (reason === "time") {
        await interaction.followUp({
          content:
            "You took too long to respond! The economy reset has been cancelled!",
          ephemeral: true,
        });
      }
    });
  },
};
