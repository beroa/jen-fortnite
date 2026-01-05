
const mainChannel = "1446587207011008565"

    // for ref: "* * * * *" min(0-59), hour(0-23), day(1-31), month(1-12), year
export let testInfo =  [
    // test 1
    {
    id: 1,
    channelId: mainChannel,
    datetime: "39 19 2 1 *",
    msg: "--==❃❃❃❃❃❃__**ᗰƐŔŔY ƇĤŔĪSƬᗰᗩS**__❃❃❃❃❃❃==--",
    img: "./scheduler-data/scheduler-pics/Weezer_Bear5.jpg",
    ping: ""
    },

    // test 2
    {
    id: 2,
    channelId: mainChannel,
    datetime: "40 19 2 1 *",
    msg: "Hale:",
    img: "./scheduler-data/scheduler-pics/Hale_1.jpg",
    ping: "@here"
    }
];


// 
// posts specified wolf related image for associated date

// export default {

//     name: Events.ClientReady,
//     once: false,

//     async execute(client) {
//         const job = schedule.scheduleJob({hour: 14, minute: 30, dayOfWeek: 0}, function(){
//   console.log('Time for tea!');
// });
//     }
// };