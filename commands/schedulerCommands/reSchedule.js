import { SlashCommandBuilder } from "discord.js";
import { createSchedule } from "../../scheduler/createSchedule.js";
import { getCurrentJobs } from "../../scheduler/getCurrentJobs.js";


// updates schedules new jobs without restarting the bot
export const command = {
    data: new SlashCommandBuilder().setName("reschedule").setDescription("reschedule jobs"),
    async execute(interaction){

        await interaction.reply(await getCurrentJobs(interaction.client));
        const client = interaction.client;
        createSchedule(client);
        
    }
};


