// const Discord = require("discord.js");

import { EmbedBuilder } from "discord.js";
import { Table } from "embed-table";

// // Schedule JSON
// const scheduleJson = {
//   monday: "17:00-24:00",
//   tuesday: "00:00-01:00,17:00-24:00",
//   wednesday: "17:00-24:00",
//   thursday: "00:00-01:00",
//   friday: "17:00-24:00",
//   saturday: "00:00-01:00,09:00-17:00",
//   sunday: "09:00-17:00",
// };

// Function to convert 24-hour time to 12-hour format with AM/PM
function to12HourFormat(hour) {
  const period = hour < 12 || hour === 24 ? "AM" : "PM";
  const twelveHour = hour % 12 === 0 ? 12 : hour % 12;
  const spacing = twelveHour < 10 ? "  " : " ";
  return `${twelveHour}${spacing}${period}`;
}

// Convert time range into blocks (▓ for busy, ░ for free)
function timeToBlocks(timeRange) {
  let blocks = "░".repeat(48); // 24 hours * 2 blocks per hour
  timeRange.split(",").forEach((range) => {
    let [start, end] = range.split("-").map((time) => {
      let [hour, minute] = time.split(":").map(Number);
      return hour * 2 + (minute === 30 ? 1 : 0);
    });
    for (let i = start; i < end; i++) {
      blocks = blocks.substring(0, i) + "▓" + blocks.substring(i + 1);
    }
  });
  return blocks;
}

// export function prettySchedule(scheduleJson) {
//   const description = generateScheduleVisual(scheduleJson);

//   const embed = new EmbedBuilder().setTitle("Weekly Schedule").setDescription(description).setColor("#0099ff");

//   return embed;
// }

// Convert schedule to a visual representation
export function prettySchedule(scheduleJSON) {
  console.log("pretty here");
  // Define the time slots
  const timeSlots = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];

  // Helper function to determine if a specific time is within a given time range
  function isTimeInRange(time, range) {
    console.log("isTimeInRange", time, range);
    const [start, end] = range.split("-").map((t) => {
      const [hour, minute] = t.split(":").map(Number);
      return hour * 60 + minute;
    });
    const [checkHour, checkMinute] = time.split(":").map(Number);
    const checkTime = checkHour * 60 + checkMinute;
    console.log("checkTime", checkTime, start, end);
    return checkTime >= start && checkTime < end;
  }

  const table = new Table({
    titles: ["Level", "Money", "Wins"],
    titleIndexes: [0, 8, 16],
    columnIndexes: [0, 6, 14],
    start: "`",
    end: "`",
    padEnd: 3,
  });

  // Helper function to create a row for the time slot
  function createTimeSlotRow(time, schedule) {
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    let row = `${to12HourFormat(time.split(":")[0])} `;
    days.forEach((day) => {
      console.log("schedule", schedule);
      console.log("day", day);
      // Determine if the time is within any of the ranges for this day
      if (!schedule[day]) {
        row += "⬛ ";
        return;
      }
      const isBooked = schedule[day]?.split(",").some((range) => isTimeInRange(time, range)) ?? false;
      row += isBooked ? "🟥 " : "⬛ ";
    });
    return row;
  }

  // Generate the schedule string
  let scheduleString = " M   T  W   T   F  S  S\n";
  timeSlots.forEach((time) => {
    scheduleString += createTimeSlotRow(time, scheduleJSON) + "\n";
  });

  // Create the embed with the visual schedule
  const embed = new EmbedBuilder()
    .setTitle("Weekly Schedule")
    .setDescription("```" + scheduleString + "```")
    .setColor(0x0099ff); // Color of the embed

  return embed;
}

// const visualSchedule = generateVisualSchedule(scheduleJson);

// // Create the embed with the visual schedule
// const embed = new MessageEmbed()
//   .setTitle('Weekly Schedule')
//   .setDescription('```' + visualSchedule + '```')
//   .setColor('#0099ff'); // Color of the embed
