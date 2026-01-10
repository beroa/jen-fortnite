import cron from "node-cron";
import { AttachmentBuilder } from "discord.js";
import { clearCronJobs } from "./clearCronJobs.js";
import { checkCron, checkImg, checkChannel } from "./checkValidity.js";


// schedules posts
export async function scheduler(client, sheetData) {
    // avoid dups
    clearCronJobs();
    
    for (let post of sheetData){
        // checking validity
        if ( 
        await checkImg(post.img, post.id) === false || 
        await checkCron(post, post.id) === false || 
        await checkChannel(client, post.channelId, post.id) === false){
            continue;
        }

        // schedule the post
        cron.schedule(post.datetime, async () =>{
            try {

                // the id is a string, we need the channel object, fetches it based off string
                const channel = await client.channels.fetch(post.channelId);
                // if the bot trys to send a msg to a channel that doesnt exist, --
                // it cant access, or a channel that doesnt take msgs,--
                //  it'll crash
                if (!channel?.isTextBased()) return;


                // img not w others so it sends above text (looks better)
                const imgs = Array.isArray(post.img) ? post.img : post.img ? [post.img] : [];
                for (const img of imgs) {
                    if (!img) continue;

                    await channel.send({files: [new AttachmentBuilder(img)]})
                };

                const msgs  = Array.isArray(post.msg)  ? post.msg  : post.msg  ? [post.msg]  : [];
                const pings = Array.isArray(post.ping) ? post.ping : post.ping ? [post.ping] : [];

                // checking msgs
                if (post.msg) {
                    for (const msg of msgs){
                        await channel.send({ content: msg });
                    }
                }
                // checking pings
                if (post.ping){
                    for (const ping of pings){
                        await channel.send({ content: ping });
                    }
                }; 

                console.log(`[schedulerMain] sent msg for post ID: ${post.id}`)
                         
            } catch (err){
                console.error(`[schedulerMain] scheduled post failed for post ID: ${post.id}, ${err}`);
            }

        
        // cron timer in this timezone
    },{ timezone: "America/New_York" })
    }

return console.log(`[schedulerMain] posts scheduled`);
};


// went with a cron scheduler instead of a Date() object scheduler, 
// cron is better for recurring jobs and has an easier time w timezones

// currently no fallback if the server crashes when the job is scheduled.





// TODO:
// 
// better img storing
// make bot ignore column "notes" in sheet
// fallback?
// validateAll() func?

// TEST
// 

// DONE
// 
// make it so bot doesnt need msg or img 
// way to schedule jobs w/o restarting bot (slash command)
// new response to /reschedule
//  /clearSchedule command to clear all scheduled jobs
// test missing values in sheets -- all tested, none crash bot or stop startup, just skips invalid posts
// have ready post at end of start up, after jobs -- moved up in main.js
//  /schedule command to update scheduled jobs
//  clearCronJobs.js function to clear all cron jobs
//  getCronJobs.js now returns current jobs, used in /reschedule command
// split into helper functions
// img file path checking
// clean it all up
// fix file names/ports
// multiple values to a key
// handle multi imgs

// the CSV for the sheet now updates about instantly, publihsing the csv to web and 
// fetching it took about 5-15 mins for it to update - caused problems for /schedule command
// importing the csv url directly updates it much faster



