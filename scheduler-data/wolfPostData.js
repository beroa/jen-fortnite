
const mainChannel = "1446587207011008565"

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

// dont schedule multiple jobs at the same time

// for ref: "* * * * *" min(0-59), hour(0-23), day(1-31), month(1-12), year, * = every
export let testInfo =  [
    // img msg ping
    {
    id: 1,
    channelId: mainChannel,
    datetime: "* * * * *",
    msg: "--==❃❃❃❃❃❃__**ᗰƐŔŔY ƇĤŔĪSƬᗰᗩS**__❃❃❃❃❃❃==--",
    img: "./scheduler-data/scheduler-pics/Weezer_Bear5.jpg",
    ping: "@here",
    loaded: false
    },

    // img msg
    {
    id: 2,
    channelId: mainChannel,
    datetime: "* * * * *",
    msg: "Hale:",
    img: "./scheduler-data/scheduler-pics/Hale_1.jpg",
    ping: "",
    loaded: false
    },

    // img
    {
    id: 3,
    channelId: mainChannel,
    datetime: "* * * * *",
    msg: null,
    img: "./scheduler-data/scheduler-pics/Hale_1.jpg",
    ping: "",
    loaded: false
    },

    // msg ping
    {
    id: 4,
    channelId: mainChannel,
    datetime: "* * * * *",
    msg: "--==❃❃❃❃❃❃__**ᗰƐŔŔY ƇĤŔĪSƬᗰᗩS**__❃❃❃❃❃❃==--",
    img: "",
    ping: "@everyone",
    loaded: false
    },

    // msg
    {
    id: 5,
    channelId: mainChannel,
    datetime: "* * * * *",
    msg: "TEST MSG",
    img: "",
    ping: "",
    loaded: false
    },

    // ping
    {
    id: 6,
    channelId: mainChannel,
    datetime: "* * * * *",
    msg: "",
    img: "",
    ping: "@here",
    loaded: false
    },

    // nuthin
    {
    id: 7,
    channelId: mainChannel,
    datetime: "* * * * *",
    msg: null,
    img: "",
    ping: "",
    loaded: false
    },
    
];

// error in 3 and 7 -- both empty msg err
// replaced with null --- now sends "null" as a msg :(
