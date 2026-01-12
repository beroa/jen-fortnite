import cron from "node-cron";
import fs from "fs/promises";


async function getValids(client, post){
    const channelResult = await checkChannel(client, post.channelId, post.id);
    const imgResult = await checkImg(post.img, post.id);
    const cronResult = checkCron(post);

    if (!channelResult.worked) return channelResult;
    if (!imgResult.worked) return imgResult;
    if (!cronResult.worked) return cronResult;

    return { worked: true };
};


// checks if chan id is valid
async function checkChannel(client, givenId, postId){
    try{
        await client.channels.fetch(givenId);
    } catch (err){
        return {worked: false, error: `[WARNING] Invalid channelId, post ID: ${postId}, skipping post`};
    }
return { worked: true };

};

// checks if file path is valid
async function checkImg(postImg, postId) {
    const imgPaths = Array.isArray(postImg) ? postImg : postImg ? [postImg] : [];
    for (const imgPath of imgPaths){
        try {
            await fs.access(imgPath);

        } catch (err) {
            return {worked: false, error: `[WARNING] Invalid img path, post ID: ${postId}, skipping post`};

        }
    }
    return { worked: true };
};


function checkCron(post){
    const cronExpr = post.datetime?.toString()

    // Skip invalid crons
    if (!cronExpr || !cron.validate(cronExpr)) {
        return {worked: false, error: `[WARNING] Invalid dateTime (cron), post ID: ${post.id}, skipping post`};
    }
    return { worked: true };
};


export {

    getValids

}