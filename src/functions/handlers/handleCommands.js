const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const chalk = require("chalk");

module.exports = (client) => {
  client.handleCommands = async () => {
    const commandFolders = fs.readdirSync("./src/commands");
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      const { commands, commandArray } = client;
      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
        console.log(
          chalk.yellowBright(
            `Command: ${command.data.name} has been passed through the register}`
          )
        );
      }
    }

    const clientId = "1194418694873419806";
    const guildId = "770447702860759050"; //dev server
    const rest = new REST({ version: "9" }).setToken(process.env.token);
    try {
      console.log(
        chalk.cyanBright("Started refreshing application (/) commands.")
      );

      const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        {
          body: client.commandArray,
        }
      );

      console.log(
        chalk.green(
          `Succesfully reloaded ${data.length} application (/) commands.`
        )
      );
    } catch (error) {
      console.log(error);
    }
    // const clientId = "1194418694873419806";
    // const guildId = "770447702860759050"; // You can remove this line
    // const rest = new REST({ version: "9" }).setToken(process.env.token);
    // try {
    //   console.log(chalk.cyanBright("Started refreshing application (/) commands."));

    //   const data = await rest.put(
    // Routes.applicationGuildCommands(clientId, guildId), // Replace this line
    //   Routes.applicationCommands(clientId), // with this line
    //   {
    //     body: client.commandArray,
    //   }
    // );

    //   console.log(
    //     chalk.green(
    //       `Succesfully reloaded ${data.length} application (/) commands.`
    //     )
    //   );
    // } catch (error) {
    //   console.log(error);
    // }
  };
};
