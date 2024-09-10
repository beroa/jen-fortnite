// Importing necessary modules and initializing dotenv
import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { Client, Collection, Events, GatewayIntentBits, Partials } from "discord.js";

// Creating instances
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
  partials: [Partials.Message, Partials.Reaction, Partials.User], // Required for handling uncached messages and reactions
});
client.commands = new Collection();

// Setting up directories
const dirname = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:\/)/, "$1");
const foldersPath = path.join(dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

// Function to asynchronously load commands
async function loadCommands() {
  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js") && !file.startsWith("db"));

    for (const file of commandFiles) {
      try {
        const filePath = `file://${path.join(commandsPath, file)}`;
        const commandModule = await import(filePath);
        const command = commandModule.command;

        if (command && "data" in command && "execute" in command) {
          client.commands.set(command.data.name, command);
        } else {
          console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
      } catch (error) {
        console.error(`Error loading command ${file}:`, error);
      }
    }
  }
}

// Event listener for interactions
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true });
    } else {
      await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
    }
  }
});

// Client ready event
client.once(Events.ClientReady, () => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
  // Load commands after the client is ready
  loadCommands().then(() => console.log("Commands loaded successfully."));
});

// Log in to Discord
client.login(process.env.bot_token);
