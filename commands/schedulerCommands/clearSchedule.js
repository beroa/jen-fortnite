import { SlashCommandBuilder } from "discord.js";
import { clearCronJobs } from "../../scheduler/clearCronJobs.js";


// clears all scheduled posts
export const command = {
    data: new SlashCommandBuilder().setName('clearschedule').setDescription('clears all scheduled posts'),
    async execute(interaction) {

        clearCronJobs();
        await interaction.reply("[clearSchedule] cleared all scheduled jobs");
        
    }
};

