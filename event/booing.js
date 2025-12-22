import { Events } from "discord.js";

        // aBoo is array of strngs func pulls from to msg
const aBoo = [
        "boooooooooooo",
        "simple minded message there pal",
        "https://tenor.com/view/boo-this-man-wwe-night-of-champions-wrestling-gif-11525013",
        "https://tenor.com/view/boo-outrage-mob-boo-this-man-throw-gif-17622488",
        "https://tenor.com/view/thumbs-down-lame-dumb-no-gif-21452086",
        "https://tenor.com/view/boo-thumbs-down-tomato-throw-gif-16146577832740096545",
        "...Nice one pal, real nice one",
        "Funny guy, right here...",
        "what kind of FOOL would send this message???",
        "real original message, never seen that one before...",
        "this message has made me very sad and ruined my day :'("
];


export default async function (message) {
            // only msg if not this channel (melee channel)
        if (message.channel.id !== '1211732643268526120') {
            //  Check if the author is the target user
            // very funny infinite loop:   if (message.author.bot) {}
            if (message.author.id === '283482064789962752' && Math.floor(Math.random() * 150) === 0) {
                    // roll a dice, send random indx from aBoo as a response if dice === 0
                await message.reply(aBoo[Math.floor(Math.random() * 11)]);
                }
            }
        };
//     };
