import dotenv from "dotenv";
dotenv.config();

import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";

const commands = [];

const dirname = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:\/)/, "$1");
const folders_path = path.join(dirname, "commands");
const command_folders = fs.readdirSync(folders_path);

// Function to import all commands using dynamic imports
async function import_commands() {
  for (const folder of command_folders) {
    const commands_path = path.join(folders_path, folder);
    const command_files = fs.readdirSync(commands_path).filter((file) => file.endsWith(".js") && !file.startsWith("db"));

    for (const file of command_files) {
      const file_path = path.join(commands_path, file);
      try {
        const command_module = await import(`file://${file_path}`);
        const command = command_module.command;

        if (command && "data" in command && "execute" in command) {
          commands.push(command.data.toJSON());
        } else {
          console.log(`[WARNING] The command at ${file_path} is missing a required "data" or "execute" property.`);
        }
      } catch (error) {
        console.error(`Error importing command from ${file_path}:`, error);
      }
    }
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.bot_token);

// Function to delete all existing commands
async function delete_commands() {
  try {
    console.log("Deleting all application (/) commands.");

    // Deletes all global commands
    await rest.put(Routes.applicationCommands(process.env.bot_client_id), { body: [] });

    // Deletes all guild-specific commands (you can loop through all your guilds if needed)
    await rest.put(Routes.applicationGuildCommands(process.env.bot_client_id, process.env.guild_id), { body: [] });

    console.log("Successfully deleted all application (/) commands.");
  } catch (error) {
    console.error("Failed to delete application (/) commands:", error);
  }
}

// Function to deploy the new commands
async function deploy_commands() {
  await import_commands(); // Make sure all commands are imported before deploying

  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // Deploy global commands
    const data = await rest.put(Routes.applicationCommands(process.env.bot_client_id), { body: commands });

    // Optionally deploy to specific guilds
    const guild_data = await rest.put(Routes.applicationGuildCommands(process.env.bot_client_id, process.env.guild_id), { body: commands });

    console.log(`Successfully reloaded ${data.length} global commands and ${guild_data.length} guild commands.`);
  } catch (error) {
    console.error("Error deploying commands:", error);
  }
}

// Execute the script
async function run() {
  await delete_commands(); // First, delete all existing commands
  await deploy_commands(); // Then, deploy the new set of commands
}

run();
