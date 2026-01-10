import cron from "node-cron";

// func to clear all cron jobs
export function clearCronJobs() {

    const scheduledTasks = cron.getTasks();
    for (const task of scheduledTasks.values()){
        task.stop();
        task.destroy();
    };
    console.log("[clearCronJobs] cleared all scheduled jobs");
};