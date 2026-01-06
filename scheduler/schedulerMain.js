import cron from "node-cron";
import { AttachmentBuilder } from "discord.js";
import { testInfo } from "../scheduler-data/wolfPostData.js";


// function for scheduling posts
export function scheduler(client) {
    for (let post of testInfo){
        // check if its been scheduled already
        if (post.loaded === true) return;

        cron.schedule(post.datetime, async () =>{
            try {

                // the id is a string, we need the channel object, fetches it based off string
                const channel = await client.channels.fetch(post.channelId);

                // if the bot trys to send a msg to a channel that doesnt exist, --
                // it cant access, or a channel that doesnt take msgs,--
                //  it'll crash
                if (!channel?.isTextBased()) return;

                // checking if img to send
                // not w others so it sends above text (looks better)
                if (post.img){
                await channel.send({
                    files: post.img?.trim() ? [new AttachmentBuilder(post.img)]: [],
                })
                };

                 // checking if msg or ping to send

                await channel.send({
                    content: post.ping?.trim() ? `${post.msg} ${post.ping}`: `${post.msg}`
                })
                // };

                console.log(`[schedulerMain] sent msg for post ID: ${post.id}`)
                         
            } catch (err){
                console.error(`[schedulerMain] scheduled post failed for post ID: ${post.id}, ${err}`);
            }
    post.loaded = true;

        // cron timer in this timezone
        },{ timezone: "America/New_York" })
    }
};

console.log(`[schedulerMain] posts scheduled`)





// went with a cron scheduler instead of a Date() object scheduler, 
// cron is better for recurring jobs and has an easier time w timezones

// currently no fallback if the server crashes when the job is scheduled.



// TODO:
// 
// way to schedule jobs w/o restarting bot (slash command)
// if missing key/value, bot crashes/ fails to start
// make it so bot doesnt need msg or img .... dont default to null :(



// DONE
// 
