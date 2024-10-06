import { EmbedBuilder } from "discord.js";

const events = new Map();
const recentMessageIds = new Map();

export const get_latest_channel_event = (channel_id) => recentMessageIds.get(channel_id);
export const set_latest_channel_event = (channel_id, message_id) => {
  recentMessageIds.set(channel_id, message_id);
};

export const get_event = (message_id) => {
  return events.get(message_id);
};

export const set_event = (message_id, channel_id) => {
  events.set(message_id, {
    channel_id,
    attending_list: [],
    waitlist: [],
  });

  if (events.length > 10) {
    const oldest_event = events.keys().next().value;
    events.delete(oldest_event);
  }
};

// Function to add a user to the attending list or waitlist
export const add_to_event = (message_id, username, attend_limit = 1) => {
  const event = events.get(message_id);
  if (!event) return null;

  // Check if the user is already in the attending list or waitlist
  if (event.attending_list.includes(username)) {
    return { status: "already_registered" };
  } else if (event.waitlist.includes(username)) {
    return { status: "already_waitlisted" };
  }

  if (event.attending_list.length < attend_limit) {
    // Add to attending list if the cap is not reached
    event.attending_list.push(username);
    return { status: "attending" };
  } else {
    // Add to waitlist if the cap is reached
    event.waitlist.push(username);
    return { status: "waitlist" };
  }
};

// Function to remove a user from the attending list or waitlist
export const remove_from_event = (message_id, username) => {
  const event = events.get(message_id);
  if (!event) return null;

  event.attending_list = event.attending_list.filter((name) => name !== username);
  event.waitlist = event.waitlist.filter((name) => name !== username);
  return { status: "removed" };
};

// function to update the embed for the event
export const update_event_message = async (message, embed, message_id, attend_limit = 1) => {
  const event = events.get(message_id);
  if (!event) return;

  const { attending_list, waitlist } = event;

  const fields = [
    {
      name: "Current Attendees:",
      value: attending_list.length > 0 ? attending_list.join(", ") : "None",
    },
    {
      name: "Spots Filled:",
      value: `${attending_list.length}/${attend_limit}`,
    },
  ];

  if (waitlist.length > 0) {
    fields.push({
      name: "Waitlist:",
      value: waitlist.map((user, index) => `${index + 1}. ${user}`).join("\n"),
    });
  }

  const updated_embed = EmbedBuilder.from(embed).setFields(fields);
  await message.edit({ embeds: [updated_embed] });
};
