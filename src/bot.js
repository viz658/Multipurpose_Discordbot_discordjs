require("dotenv").config();

const { token, databaseToken, OPENAI_KEY } = process.env;
const { connect } = require("mongoose");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { OpenAI } = require("openai");
const fs = require("fs");
//music 
const { DisTube } = require("distube");

const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');

//main client
const client = new Client({
  //32767 for all intents
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
  ],
});
client.commands = new Collection();
client.commandArray = [];
client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: true,// you can change this to your needs
  emitAddSongWhenCreatingQueue: false,
  plugins: [new SpotifyPlugin(), new SoundCloudPlugin(), new YtDlpPlugin()]
});
let status = (queue) =>
      `Volume: \`${queue.volume}%\` | Filter: \`${
        queue.filters.names.join(", ") || "Off"
      }\` | Loop: \`${
        queue.repeatMode
          ? queue.repeatMode === 2
            ? "All Queue"
            : "This Song"
          : "Off"
      }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;
client.distube.on("playSong", async (queue, song) => {
  if (queue.currentMessage) {
    queue.currentMessage.delete().catch(console.error);
    queue.currentMessage = undefined;
  }

  // Send the music card
  await client.sendMusicCard(queue, song).catch(console.error);
});
client.distube.on("addSong", (queue, song) => {
  queue.textChannel.send(
    `🎶 Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
  );
});
client.distube.on("addList", (queue, playlist) => {
  queue.textChannel.send(
    `🎶 Added \`${playlist.name}\` playlist (${
      playlist.songs.length
    } songs) to queue\n${status(queue)}`
  );
});
client.distube.on("error", (channel, e) => {
  console.error(e);
});
client.distube.on("empty", (channel) => {
  channel.send("⛔ Voice channel is empty! Leaving the channel...");
});
client.distube.on("searchNoResult", (message, query) => {
  message.channel.send(`⛔ No result found for \`${query}\`!`);
});
client.distube.on("finish", (queue) => {
  queue.textChannel.send("🏁 Queue finished!").then((message) => {
    queue.currentMessage = message;
  });
  queue.connection.disconnect();
});
//giveaways
const GiveawaysManager = require("./giveaways.js");
client.giveawayManager = new GiveawaysManager(client, {
  default : {
    botsCanWin: false,
    embedColor: "#0af593",
    embedColorEnd: "#ab030c",
    reaction: "🎉"
  }
})
//anticrash
// const processs = require("node:process");

// processs.on("unhandledRejection", async (reason, promise) => {
//   console.log("Unhandled Rejection at:", promise, "reason:", reason);
// });
// processs.on("uncaughtException", async (error) => {
//   console.log("Uncaught Exception:", error);
// });
// processs.on("uncaughtExceptionMonitor", (err, origin) => {
//   console.log("Uncaught Exception Monitor:", err, origin);
// });

const functionFolders = fs.readdirSync("./src/functions");
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}


client.handleEvents();
client.handleCommands();
client.login(token);
connect(databaseToken).catch(console.error);
(async () => {
  await connect(databaseToken).catch(console.error);
})();

//GPT BOT-premium/private only
const CHANNELS = ["1200583320325603409"]; //channel ids array

const openai = new OpenAI({
  apiKey: OPENAI_KEY,
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (
    !CHANNELS.includes(message.channelId) &&
    !message.mentions.users.has(client.user.id)
  )
    return;

  await message.channel.sendTyping();

  const sendTypingInterval = setInterval(() => {
    message.channel.sendTyping();
  }, 5000);

  let conversation = [];

  conversation.push({
    role: "system",
    content: "Chat GPT is a friendly chatbot.",
  });

  let prevMessages = await message.channel.messages.fetch({ limit: 10 });
  prevMessages.reverse();

  prevMessages.forEach((msg) => {
    if (msg.author.bot && msg.author.id !== client.user.id) return;

    const username = msg.author.username
      .replace(/\s+/g, "_")
      .replace(/[^\w\s]/gi, "");

    if (msg.author.id === client.user.id) {
      conversation.push({
        role: "assistant",
        name: username,
        content: msg.content,
      });

      return;
    }

    conversation.push({
      role: "user",
      name: username,
      content: msg.content,
    });
  });

  const response = await openai.chat.completions
    .create({
      model: "gpt-3.5-turbo",
      messages: conversation,
    })
    .catch((error) => console.error("OpenAI Error:\n", error));

  clearInterval(sendTypingInterval);

  if (!response) {
    message.reply(
      "I'm having some trouble with the OpenAI API. Try again in a moment."
    );
    return;
  }

  const responseMessage = response.choices[0].message.content;
  const chunkSizeLimit = 2000;

  for (let i = 0; i < responseMessage.length; i += chunkSizeLimit) {
    const chunk = responseMessage.substring(i, i + chunkSizeLimit);

    await message.reply(chunk);
  }
});
