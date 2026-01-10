// import { currentJobs } from "./schedulerMain.js";
import { loadPostsFromSheet } from "./createSchedule.js";
import { checkChannel, checkImg } from "./checkValidity.js";

export async function getCurrentJobs(client) {

    let currentJobs = [];
    let errJobs = [];
    let posts = await loadPostsFromSheet();
    for (let post of posts){
        // check channel Id is valid
        if (await checkChannel(client, post.channelId, post.id) === true 
            && await checkImg(post.img, post.id) === true){ 
            currentJobs.push(post.id);
        } else {
            errJobs.push(post.id);
        };
    };
    // return valid and invalid jobs
    if (errJobs.length > 0){
        return `[reSchedule] updating schedule, current job IDs: ${currentJobs.join(", ")}   |   [ERROR], skipping these: ${errJobs.join(", ")}`;
    } else {
        return `[reSchedule] updating schedule, current job IDs: ${currentJobs.join(", ")}`;
    }
};

