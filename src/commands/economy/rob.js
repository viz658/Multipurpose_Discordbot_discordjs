const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Balance = require("../../schemas/balance");
const currencySchema = require("../../schemas/customCurrency.js");
const serverBank = require("../../schemas/ServerBank.js");

const cooldowns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rob")
    .setDescription("Rob a users wallet")
    .setDMPermission(false)
    .addUserOption((option) =>
      option.setName("user").setDescription("User to rob").setRequired(true)
    ),
  category: "economy",
  async execute(interaction, client) {
    const userbalance = await client.fetchBalance(
      interaction.user.id,
      interaction.guild.id
    );
    if(userbalance.inJail) {
      return await interaction.reply({
        content: "You cannot access economy commands while in jail!",
        ephemeral: true,
      });
    }
    const targetUser = interaction.options.getUser("user");
    const userId = interaction.user.id;
    const guildBank = await client.fetchBank(interaction.guild.id);
    if (cooldowns.has(userId)) {
        const expirationTime = cooldowns.get(userId) + 1000 * 60 * 60;
    const timeLeft = (expirationTime - Date.now()) / 1000 / 60;
      return await interaction.reply({
        
        content: `You are currently on cooldown for this command. Please wait ${timeLeft.toFixed(1)} more minute(s) before using it again.`,
        ephemeral: true,
      });
    }
    cooldowns.set(userId, Date.now());
    setTimeout(() => {
      cooldowns.delete(userId);
    }, 1000 * 60 * 60); // hr cooldown 1000 * 60 * 60

    const userStoredBalance = await client.fetchBalance(
      interaction.user.id,
      interaction.guild.id
    );
    const targetUserBalance = await client.fetchBalance(
      targetUser.id,
      interaction.guild.id
    );
    let currdata = await currencySchema.findOne({
      Guild: interaction.guild.id,
    });
    let currency = currdata ? currdata.Currency : "$";
    if (targetUser.bot || targetUser.id == interaction.user.id)
      return await interaction.reply({
        content: "You can't rob a bot or yourself!",
        ephemeral: true,
      });
    else if (targetUserBalance.balance < 1.0)
      return await interaction.reply({
        content: `You can't rob a user with less than ${currency} 1.00!`,
        ephemeral: true,
      });
    let roboutcome = Math.floor(Math.random() * 2);
    if (roboutcome === 1) {
      let robAmount = Math.floor(Math.random() * targetUserBalance.balance) + 1;
      await Balance.findOneAndUpdate(
        {
          _id: targetUserBalance._id,
        },
        {
          balance: await client.toFixedNumber(
            targetUserBalance.balance - robAmount
          ),
        }
      );
      await Balance.findOneAndUpdate(
        {
          _id: userStoredBalance._id,
        },
        {
          balance: await client.toFixedNumber(
            userStoredBalance.balance + robAmount
          ),
        }
      );
      const embed = new EmbedBuilder()
        .setTitle("💰 Robbery successful")
        .setColor("Green")
        .setTimestamp()
        .setDescription(
          `You robbed ${currency} ${robAmount} from ${targetUser.tag}!`
        )
        .setFooter({
          text: client.user.tag,
          iconURL: client.user.displayAvatarURL(),
        });
      //if guild has icon set thumbnail to guild icon
      if (interaction.guild.iconURL()) {
        embed.setThumbnail(interaction.guild.iconURL());
      }
      return await interaction.reply({
        embeds: [embed],
      });
    } else {
      let punishment =
        Math.floor(Math.random() * userStoredBalance.balance) + 1;
      await Balance.findOneAndUpdate(
        {
          _id: userStoredBalance._id,
        },
        {
          balance: await client.toFixedNumber(
            userStoredBalance.balance - punishment
          ),
        }
      );
      await serverBank.findOneAndUpdate(
        {
          _id: guildBank._id,
        },
        {
          bank: await client.toFixedNumber(guildBank.bank + punishment),
        }
      );
      await client.toFixedNumber(punishment);
      const embed = new EmbedBuilder()
        .setTitle("🚓Robbery failed")
        .setColor("Red")
        .setTimestamp()
        .setDescription(
          `You were caught trying to rob ${targetUser.tag} and spent ${currency} ${punishment} on bail!`
        )
        .setFooter({
          text: client.user.tag,
          iconURL: client.user.displayAvatarURL(),
        });
      if (interaction.guild.iconURL()) {
        embed.setThumbnail(interaction.guild.iconURL());
      }
      return await interaction.reply({
        embeds: [embed],
      });
    }
  },
};
