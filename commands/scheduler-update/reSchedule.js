import { SlashCommandBuilder } from "discord.js";
import { scheduler } from "../../scheduler/schedulerMain.js";

// updates schedules new jobs without restarting the bot
export const command = {
    data: new SlashCommandBuilder().setName("schedule").setDescription("reschedule jobs"),
    async execute(interaction){
        const client = interaction.client;
        await scheduler(client);
    }
};