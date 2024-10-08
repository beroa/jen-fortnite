import { EmbedBuilder } from "discord.js";

export const ATTEND_LIMIT = 14;

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
export const add_to_event = (message_id, user) => {
  const event = events.get(message_id);
  if (!event) return null;

  // Check if the user is already in the attending list or waitlist
  if (event.attending_list.includes(user)) {
    return { status: "already_registered" };
  } else if (event.waitlist.includes(user)) {
    return { status: "already_waitlisted" };
  }

  if (event.attending_list.length < ATTEND_LIMIT) {
    event.attending_list.push(user);
    return { status: "attending" };
  } else {
    event.waitlist.push(user);
    return { status: "waitlist" };
  }
};

// Function to remove a user from the attending list or waitlist
export const remove_from_event = (message_id, user) => {
  const event = events.get(message_id);
  if (!event) return null;

  let waitlist_invite = null;

  event.attending_list = event.attending_list.filter((u) => u.id !== user.id);
  event.waitlist = event.waitlist.filter((u) => u.id !== user.id);

  if (event.attending_list.length < ATTEND_LIMIT) {
    // Move the first user from the waitlist to the attending list
    const first_waitlisted = event.waitlist.shift();
    if (first_waitlisted) {
      event.attending_list.push(first_waitlisted);
      waitlist_invite = first_waitlisted;
    }
  }

  return waitlist_invite;
};

// function to update the embed for the event
export const update_event_message = async (message, embed, message_id) => {
  const event = events.get(message_id);
  if (!event) return;

  const { attending_list, waitlist } = event;

  const fields = [
    {
      name: "Current Attendees:",
      value: attending_list.length > 0 ? attending_list.map((s) => s.username).join(", ") : "None",
    },
    {
      name: "Spots Filled:",
      value: `${attending_list.length}/${ATTEND_LIMIT}`,
    },
  ];

  if (waitlist.length > 0) {
    fields.push({
      name: "Waitlist:",
      value: waitlist.map((user, index) => `${index + 1}. ${user.username}`).join("\n"),
    });
  }

  const updated_embed = EmbedBuilder.from(embed).setFields(fields);
  await message.edit({ embeds: [updated_embed] });
};
