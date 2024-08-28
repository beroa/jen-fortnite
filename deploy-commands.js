import dotenv from "dotenv";
dotenv.config();

import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";

const commands = [];

const dirname = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:\/)/, "$1");
const foldersPath = path.join(dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

// Function to import all commands using dynamic imports
async function importCommands() {
  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      try {
        const commandModule = await import(`file://${filePath}`);
        const command = commandModule.command;

        if (command && "data" in command && "execute" in command) {
          commands.push(command.data.toJSON());
        } else {
          console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
      } catch (error) {
        console.error(`Error importing command from ${filePath}:`, error);
      }
    }
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.bot_token);

// Deploy your commands!
async function deployCommands() {
  await importCommands(); // Make sure all commands are imported before deploying

  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(Routes.applicationGuildCommands(process.env.bot_client_id, process.env.guild_id), { body: commands });

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
}

deployCommands();
