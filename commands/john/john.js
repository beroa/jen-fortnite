import { SlashCommandBuilder } from "discord.js";

// export const command = {
//   data: new SlashCommandBuilder()
//     .setName("john")
//     .setDescription("generate a john")
//     .addStringOption((option) =>
//       option.setName("schedule").setDescription("describe your availability in natural language").setRequired(true)
//     ),
//   async execute(interaction, gpt) {},
// };

export const command = {
  data: new SlashCommandBuilder().setName("john").setDescription("tell them why that's bullshit"),
  async execute(interaction) {
    let prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const john = johns[Math.floor(Math.random() * johns.length)];
    const suffix = Math.random() < 0.1 ? suffixes[Math.floor(Math.random() * suffixes.length)] : "";

    let critical_hit = Math.random() < 0.1;

    if (critical_hit) {
      prefix = rage_prefixes[Math.floor(Math.random() * rage_prefixes.length)];
    }

    let response = `${prefix}${john}${suffix}`;

    if (critical_hit) {
      response = response.toUpperCase();
      // add three characters to the end of the string, each has a 50-50 between ! and 1
      for (let i = 0; i < Math.floor(Math.random() * 5); i++) {
        response += ["1", "!"][ Math.floor(.25 + Math.random() * 1.75)];
      }
    }

    await interaction.reply(response);
  },
};

const rage_prefixes = ["that was bullshit, ", "you suck, ", "fuck you, "];
const prefixes = [
  ...rage_prefixes,
  "bad games, ",
  "you only won because ",
  "i only lost because ",
  "not gonna lie, ",
  "low-key though, ",
  "to be fair, ",
  "come on, ",
  "",
];

const suffixes = [" ffs", " dumbass"];

const johns = [
  "my controller's broken",
  "the tv has lag",
  "i wasn't even trying",
  "i didn't get a chance to warm up",
  "the sun was in my eyes",
  "i wasn't paying attention",
  "i had a headache",
  "you got lucky",
  "the buttons on this controller are sticky",
  "my mom called during the match",
  "i was distracted by your outfit",
  "my cat jumped on me",
  "you're using a cheap character",
  "i just wasn't in the mood to play",
  "you've been practicing more than me",
  "the chair was uncomfortable",
  "i'm out of practice",
  "i didn't get enough sleep",
  "i just forgot to eat breakfast",
  "the screen was too small",
  "the screen was too big it was hurting my neck",
  "i wasn't taking it seriously",
  "next time i'll try",
  "i guess i should try a liiittle bit",
  "that was just a warning match",
  "that was just a warning set",
  "my wrist was hurting",
  "my ankle was killing me",
  "the lighting in there was bad",
  "you were being too loud",
  "i got a bad start",
  "i'm too hungry to concentrate",
  "the music was distracting",
  "i'm tired",
  "i was thinking about something else",
  "my controller was slippery",
  "the volume was too low",
  "the volume was too high",
  "i'm allergic to something in the room",
  "i had an itch",
  "i'm not used to this controller",
  "i just got new glasses",
  "my glasses were foggy",
  "you used cheap tactics",
  "you used illegal moves",
  "i had to sneeze",
  "i wasn't sitting comfortably",
  "i was looking at my phone",
  "i wasn't holding the controller right",
  "my hands were too sweaty",
  "the air conditioning was too cold",
  "you play all the time",
  "the game is rigged",
  "the chair was squaking every time i moved",

  "my dog gave me the sad eyes mid-match",
  "the ghost of my gamecube was haunting me",
  "the wifi waves messed up my brainwaves",
  "i saw a spider and lost focus",
  "i was too busy contemplating the meaning of life",
  "my thumb was thinking about retirement",
  "a mosquito bit me at the crucial moment",
  "the moon's gravitational pull was off",
  "i was distracted by a philosophical debate in my head",
  "my controller was possessed by an angry spirit",
  "the stars weren't aligned in my favor",
  "i was just letting you feel good about yourself",
  "my third eye was just closed",
  "i just got lost in the matrix",
  "i just got lost in the sauce",
  "i was too focused promoting the virtue of peace",
  "my brain was buffering",
  "i was busy writing my autobiography in my head",
  "i was just trying to decode the hidden messages in the game",
  "i had an out-of-body experience mid-match",
  "i was conducting a psychological experiment on myself",

  "you know i can't grab well after dinner",
  "you cant expect me to beat falco on the anniversary of pearl harbor",
  "the window was open",
  "i felt like my body was rejecting itself",
  "you kept landing forward smash",
  "what a stupid character",
  "you intentionally picked the disgusting green kirby alt to make me feel nauseous",
  "i would've played better if the proletariats weren't rising against the bourgeoisie all the goddamn time",
  "i had a dick up my ass",
  "the controller was in my eyes",
  "my controller lags when i'm getting combo'd",
  "the resolution on the tv wasn't correct",
  "i would have beat you if my snot wasn't against me",
  "that doesn't count because i don't think you meant to do that",
  "my controller felt hollow and too light",
  "my controller is too heavy",
  "my turnip game is trash around noon",
  "you weren't as drunk as me!",
  "you didn't stop fighting while i sneezed",
  "my controller is haunted",
  "someone walked up to the setup, slowly, and kicked my chair",
  "the wind blew the curtains around my peripheral vision and distracted me",
  "i didn't expect you to be good so i didn't try that hard",
  "my hands are too big to play smash",
  "my hands are too small to play smash",
  "stop using projectiles",
  "i worked 9-5",
  "the pressure in my r-trigger felt wrong",
  "my mom died when i was in high school and sometimes i don't play well because of it",
  "there was someone standing behind me so i couldn't focus",
  "the matchup is like 7:3 in your favor",
  "if you didn't sdi my up air those 3 times, i would have won",
  "my controller wasn't even plugged in correctly",
  "there was sand in my controller",
  "there was sand in my eyes",
  "there was sand in my headphones",
  "there was sand in the tv",
  "there was sand in my socks",
  "there was sand in my ears",
  "you just spam those same 5 moves",
  "i SD'd",
  "you keep slapping the controller out of my hands and trying to touch me with your dick",
  "i had a lag in my right eye that's why i didn't dodge your fsmash",
  "i taught you how to do that so i technically threw the match you're welcome",
  "you only beat me because you use grabs. grabs are cheap. you can't even shield them",
  "the DI button on my controller was broken",
  "i pressed the button but it didn't do the thing",
  "that was a warning set",
  "my knee hurts today",
  "my knees were weak",
  "my palms were heavy",
  "there was vomit on my sweater",
  "the c-stick was making me jump",
  "you unplugged my controller and kicked me in the shins",
  "the game glitched",
  "i think that was on .9 ratio?",
  "these gamecube controllers are awful, i want my ps4 controller",
  "i was ahead so i got cocky",
  "your character is dumb and you're using stupid jank and gimmicks",
  "i wasn't my favorite color",
  "i thought we were gonna be playing smash ultimate",
  "i thought we were gonna be playing connect 4",
  "i thought we were gonna be playing checkers",
  "i thought we were gonna be playing madden",
  "i thought we were gonna be playing FIFA",
  "you were breathing too loudly",
  "my fingers weren't working right",
  "why did the game do side b when i pressed up b?!?",
  "my hands were cold",
  "i was just nervous",
  "the game stole my jump",
  "that had to be a cosmic ray bit flip",
  "nobody cares about this dumbass kids game",
  "a section of my nervous system shut down",
  "i got 0-death'd that last stock",

  "my vape died",
  "i hit my pen too much",
  "i couldn't stop thinking about the one who got away",
  "my vape died i hit my pen too much and i couldn't stop thinking about the one who got away",
];