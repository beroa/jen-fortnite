import cron from "node-cron";
import fs from "fs/promises";


// checks if chan id is valid
async function checkChannel(client, givenId, postId){
    try{
        await client.channels.fetch(givenId);
        return true;
    } catch (err){
        console.error(`[WARNING] Invalid channelId, post ID: ${postId}, skipping post`);
        return false;   
    }

};

// checks if file path is valid
async function checkImg(postImg, postId) {
    const imgPaths = Array.isArray(postImg) ? postImg : postImg ? [postImg] : [];
    for (const imgPath of imgPaths){
        try {
            await fs.access(imgPath);
            continue;
        } catch (err) {
            console.error(`[WARNING] Invalid img path, post ID: ${postId}, skipping post`);
            return false;
        }
    }
    return true;
};


function checkCron(post){
    const cronExpr = post.datetime?.toString()

    // Skip invalid crons
    if (!cronExpr || !cron.validate(cronExpr)) {
        console.warn(`[WARNING] Invalid dateTime (cron), post ID: ${post.id}, skipping post`);
        return false;
    }
};


export {
    checkChannel,
    checkImg,
    checkCron
}