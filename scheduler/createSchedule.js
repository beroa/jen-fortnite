import { parse } from "csv-parse/sync";
import { scheduler } from "./schedulerMain.js";

// spreadsheet: https://docs.google.com/spreadsheets/d/189MnqmH0EpeLxNmhlmkt6CsfL0Te3sZQhBP8l5bjim4/edit?gid=0#gid=0



// loads posts from google sheets as a CSV
export async function loadPostsFromSheet() {
    // originally used published csv, now using export link for more instant updates
    const sheetId = "189MnqmH0EpeLxNmhlmkt6CsfL0Te3sZQhBP8l5bjim4"
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
    const res = await fetch(url);

    // convert response(csv file) into text
    const text = await res.text();

    let posts = parse(text, {
        columns: true,
        skip_empty_lines: true
    });

    posts = posts.map(post => splitValues(post));


    return posts;
    
}

// splits words that are "," seperated into multiple values
function splitValues(post) {
    let keys = Object.keys(post);

    for (let key of keys) {
        if (typeof post[key] === "string" && post[key].includes(",")) {
            post[key] = post[key]
                .split(",")       // split by comma
                .map(v => v.trim()); // trim whitespace
        }
    }

    return post;
}


// gets loaded posts and sends to scheduler
export async function createSchedule(client) {
    let sheetData = await loadPostsFromSheet();
    await scheduler(client, sheetData);
};







// OLD
    // Template

    // XX NAME XX
        // {
        // id: 0,
        // channelId: mainChannel,
        // datetime: "* * * * *",
        // msg: "",
        // img: "",
        // ping: "",
        // loaded: false
        // },

    // for ref: "* * * * *" min(0-59), hour(0-23), day(1-31), month(1-12), year, * = every

    // export let testInfo =  [
        
    //     // img msg ping
    //     {
    //     id: 1,
    //     channelId: mainChannel,
    //     datetime: "* * * * *",
    //     msg: "--==❃❃❃❃❃❃__**ᗰƐŔŔY ƇĤŔĪSƬᗰᗩS**__❃❃❃❃❃❃==--",
    //     img: "./imports/Wolf-Scheduler/Wolf-Pics/Hale_1.jpg",
    //     ping: "@here",
    //     loaded: false
    //     },
        
    // ];


