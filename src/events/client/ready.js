const chalk = require("chalk");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    setInterval(client.pickPresence, 10000);
    console.log(chalk.bgGreen(`${client.user.tag} is online`));

    setInterval(client.checkVideo, 60 * 10000);
  },
};
