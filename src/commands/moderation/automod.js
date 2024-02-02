const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");
const automodSchema = require("../../schemas/Automod.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("automod")
    .setDescription("Automod system")
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand.setName("enable").setDescription("Enable automod")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("disable").setDescription("Disable automod")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("flag-words")
        .setDescription("Block profanity or unpermitted nsfw content")
        .addChannelOption((option) =>
          option
            .setName("flag-alerts")
            .setDescription(
              "The channel to send flag alerts when a rule is triggered"
            )
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("spam")
        .setDescription("Block spamming messages")
        .addChannelOption((option) =>
          option
            .setName("spam-alerts")
            .setDescription(
              "The channel to send spam alerts when a rule is triggered"
            )
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("mentions")
        .setDescription("Block mass mentions")
        .addIntegerOption((option) =>
          option
            .setName("max")
            .setDescription("Max amount of mentions that can be sent")
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("mentions-alerts")
            .setDescription(
              "The channel to send mentions alerts when a rule is triggered"
            )
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("keywords")
        .setDescription("Block list of keywords in the server")
        .addStringOption((option) =>
          option
            .setName("word")
            .setDescription("The word to block")
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("keywords-alerts")
            .setDescription(
              "The channel to send keywords alerts when a rule is triggered"
            )
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    ),

  category: "moderation",
  async execute(interaction) {
    const { guild, options } = interaction;
    const sub = options.getSubcommand();
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "⚠️You do not have the required permissions to use this command!⚠️"
        );
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }
    const data = await automodSchema.findOne({ Guild: guild.id });
    switch (sub) {
      case "flag-words":
        const flagChannel = options.getChannel("flag-alerts");
        if (!data) {
          await automodSchema.create({ Guild: guild.id, isEnabled: false });
        }
        if (data.isEnabled === false) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "⚠️Automod system is disabled on this server! If you want to enable /automod enable⚠️"
            );
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const embed3 = new EmbedBuilder()
          .setColor("Blue")
          .setDescription("🔃Loading flag-words rule...");
        await interaction.reply({ embeds: [embed3], ephemeral: true });
        const rule = await guild.autoModerationRules
          .create({
            name: "Flag-words Automod system by Vizsguard",
            creatorId: "1194418694873419806",
            enabled: true,
            eventType: 1,
            triggerType: 4, //flag words
            triggerMetadata: {
              presets: [1, 2, 3],
            },
            actions: [
              {
                type: 1,
                metadata: {
                  channel: interaction.channel,
                  durationSeconds: 8,
                  customMessage:
                    "Message prevented by Vizsguard automod system",
                },
              },
              {
                type: 2,
                metadata: {
                  channel: flagChannel,
                },
              },
            ],
          })
          .catch(async (err) => {
            setTimeout(async () => {
              console.log(err);
              const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                  "🚨 An error occurred while creating the rule..."
                );
              await interaction.editReply({ embeds: [embed], ephemeral: true });
            }, 2000);
          });

        setTimeout(async () => {
          if (!rule) return;
          const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              "✅ Flag-words rule has been created successfully!"
            );
          await interaction.editReply({ embeds: [embed], ephemeral: true });
        }, 3000);
        break;

      case "keywords":
        const keywordChannel = options.getChannel("keywords-alerts");
        if (!data) {
          await automodSchema.create({ Guild: guild.id, isEnabled: false });
        }
        if (data.isEnabled === false) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "⚠️Automod system is disabled on this server! If you want to enable /automod enable⚠️"
            );
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const embed4 = new EmbedBuilder()
          .setColor("Blue")
          .setDescription("🔃Loading keywords rule...");
        await interaction.reply({ embeds: [embed4], ephemeral: true });
        const word = options.getString("word");
        const rule2 = await guild.autoModerationRules
          .create({
            name: "Keywords Automod system by Vizsguard",
            creatorId: "1194418694873419806",
            enabled: true,
            eventType: 1,
            triggerType: 1, //flag keywords
            triggerMetadata: {
              keywordFilter: [`${word}`],
            },
            actions: [
              {
                type: 1,
                metadata: {
                  channel: interaction.channel,
                  durationSeconds: 8,
                  customMessage:
                    "Message prevented by Vizsguard automod system",
                },
              },
              {
                type: 2,
                metadata: {
                  channel: keywordChannel,
                },
              },
              {
                type: 3,
                metadata: {
                  channel: interaction.channel,
                  durationSeconds: 30,
                  customMessage:
                    "Your message was removed due to a keyword filter! Timedouut for 30 seconds!",
                },
              },
            ],
          })
          .catch(async (err) => {
            setTimeout(async () => {
              console.log(err);
              const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                  "🚨 An error occurred while creating the rule..."
                );
              await interaction.editReply({ embeds: [embed], ephemeral: true });
            }, 2000);
          });

        setTimeout(async () => {
          if (!rule2) return;
          const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              `✅ ${word} has been sucesfully added to the keywords rule!`
            );
          await interaction.editReply({ embeds: [embed], ephemeral: true });
        }, 3000);
        break;

      case "spam":
        const spamChannel = options.getChannel("spam-alerts");
        if (!data) {
          await automodSchema.create({ Guild: guild.id, isEnabled: false });
        }
        if (data.isEnabled === false) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "⚠️Automod system is disabled on this server! If you want to enable /automod enable⚠️"
            );
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const embed5 = new EmbedBuilder()
          .setColor("Blue")
          .setDescription("🔃Loading Spam rule...");
        //const number = options.getInteger("max");
        await interaction.reply({ embeds: [embed5], ephemeral: true });
        const rule3 = await guild.autoModerationRules
          .create({
            name: "Spam Automod system by Vizsguard",
            creatorId: "1194418694873419806",
            enabled: true,
            eventType: 1,
            triggerType: 3, //spam
            actions: [
              {
                type: 1,
                metadata: {
                  channel: interaction.channel,
                  durationSeconds: 8,
                  customMessage:
                    "Message prevented by Vizsguard automod system",
                },
              },
              {
                type: 2,
                metadata: {
                  channel: spamChannel,
                },
              },
            ],
          })
          .catch(async (err) => {
            setTimeout(async () => {
              console.log(err);
              const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                  "🚨 An error occurred while creating the rule..."
                );
              await interaction.editReply({ embeds: [embed], ephemeral: true });
            }, 2000);
          });

        setTimeout(async () => {
          if (!rule3) return;
          const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription("✅ Spam rule has been created successfully!");
          await interaction.editReply({ embeds: [embed], ephemeral: true });
        }, 3000);
        break;

      case "mentions":
        const mentionsChannel = options.getChannel("mentions-alerts");
        if (!data) {
          await automodSchema.create({ Guild: guild.id, isEnabled: false });
        }
        if (data.isEnabled === false) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "⚠️Automod system is disabled on this server! If you want to enable /automod enable⚠️"
            );
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const embed6 = new EmbedBuilder()
          .setColor("Blue")
          .setDescription("🔃Loading mentions rule...");
        const max = options.getInteger("max");
        await interaction.reply({ embeds: [embed6], ephemeral: true });
        const rule4 = await guild.autoModerationRules
          .create({
            name: "Mention spam Automod system by Vizsguard",
            creatorId: "1194418694873419806",
            enabled: true,
            eventType: 1,
            triggerType: 5, //mentions spam
            triggerMetadata: {
              mentionTotalLimit: max,
            },
            actions: [
              {
                type: 1,
                metadata: {
                  channel: interaction.channel,
                  durationSeconds: 10,
                  customMessage:
                    "Message prevented by Vizsguard automod system",
                },
              },
              {
                type: 2,
                metadata: {
                  channel: mentionsChannel,
                },
              },
              {
                type: 3,
                metadata: {
                  channel: interaction.channel,
                  durationSeconds: 30,
                  customMessage:
                    "Mention spam detected! Timed out for 30 seconds!",
                },
              },
            ],
          })
          .catch(async (err) => {
            setTimeout(async () => {
              console.log(err);
              const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                  "🚨 An error occurred while creating the rule..."
                );
              await interaction.editReply({ embeds: [embed], ephemeral: true });
            }, 2000);
          });

        setTimeout(async () => {
          if (!rule4) return;
          const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription("✅ Mentions rule has been created successfully!");
          await interaction.editReply({ embeds: [embed], ephemeral: true });
        }, 3000);
        break;

      case "enable":
        if (!data) {
          await automodSchema.create({ Guild: guild.id, isEnabled: false });
        }
        if (data.isEnabled === true) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "⚠️Automod system is already enabled on this server! If you want to disable /automod disable⚠️"
            );
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
          await automodSchema.findOneAndUpdate(
            { Guild: guild.id },
            { Guild: guild.id, isEnabled: true }
          );
          const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              "✅Automod system has been successfully enabled! You may now add rules"
            );
          await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        break;

      case "disable":
        if (!data) {
          await automodSchema.create({ Guild: guild.id, isEnabled: false });
        }
        if (data.isEnabled === false) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "⚠️Automod system is already disabled on this server! If you want to enable /automod enable⚠️"
            );
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
          await interaction.deferReply({ ephemeral: true });
          //fetch all automoderation rules in the guild and delete
          const rules = await guild.autoModerationRules.fetch();
          let cnt = 0;

          // Create an array of promises for each rule deletion
          const deletePromises = rules.map(async (rule) => {
            await rule
              .delete("Automod system has been disabled!")
              .catch((err) => {
                return;
              });
            cnt++;
            const embed = new EmbedBuilder()
              .setColor("Blue")
              .setDescription(`🔃Deleted ${cnt} automod rules...`);
            await interaction.editReply({ embeds: [embed], ephemeral: true });
          });

          // Wait for all rule deletions to complete
          await Promise.all(deletePromises);

          await automodSchema.findOneAndUpdate(
            { Guild: guild.id },
            { Guild: guild.id, isEnabled: false }
          );
          const cembed = new EmbedBuilder()
            .setColor("Green")
            .setDescription("✅Automod system has been successfully disabled!");
          await interaction.editReply({ embeds: [cembed], ephemeral: true });
        }
        break;
    }
  },
};
