const { ActivityType } = require("discord.js");

module.exports = (client) => {
  client.pickPresence = async () => {
    const options = [
      {
        type: ActivityType.Watching,
        text: "over the server",
        status: "idle",
      },
      {
        type: ActivityType.Competing,
        text: "the best multipurpose bot",
        status: "dnd",
      },
      {
        type: ActivityType.Listening,
        text: "commands",
        status: "idle",
      },
      {
        type: ActivityType.Playing,
        text: "with discord.js",
        status: "online",
      },
    ];

    const option = Math.floor(Math.random() * options.length);

    client.user.setPresence({
      activities: [
        {
          name: options[option].text,
          type: options[option].type,
        },
      ],
      status: options[option].status,
    });
  };
};
