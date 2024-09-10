import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { get_event, set_event, add_to_event, remove_from_event, set_recent_message_id, update_event_message } from "./db_events.js";

const ATTEND_LIMIT = 14;
const AUTHORIZED_USER_IDS = [process.env.user_id];

export const command = {
  data: new SlashCommandBuilder().setName("makeberbs").setDescription("generate signup for berbs"),
  // .addStringOption((option) => option.setName("imgur")),

  async execute(interaction, client) {
    if (!is_authorized(interaction.user.id, AUTHORIZED_USER_IDS)) {
      await interaction.reply({ content: "you're not my dad!", ephemeral: true });
      return;
    }

    const title = generate_event_title();
    const event_message = await create_event_message(interaction, title);

    console.log("event_message", event_message);

    await add_reactions(event_message);

    // Associate the event with the specific message ID
    set_event(event_message.id, interaction.channelId);
    set_recent_message_id(interaction.channelId, event_message.id);

    console.log("set_event event_message.id", event_message.id);

    // Event listeners for reactions
    client.on("messageReactionAdd", (reaction, user) => handle_reaction_add(reaction, user, event_message.id, title));
    client.on("messageReactionRemove", (reaction, user) => handle_reaction_remove(reaction, user, event_message.id));
  },
};

const is_authorized = (user_id, authorized_ids) => authorized_ids.includes(user_id);

const generate_event_title = () => `berbs #${100 + Math.floor(Math.random() * 200)}`;

const create_event_message = async (interaction, title) => {
  const embed = new EmbedBuilder()
    .setColor(0x00ff00)
    .setTitle(title)
    .setDescription("React to RSVP!\nBracket Start:  \n🟢 Attending | 🔴 Not Attending")
    .addFields({ name: "Current Attendees:", value: "None" }, { name: "Spots Filled:", value: `0/${ATTEND_LIMIT}` });

  return await interaction.reply({ embeds: [embed], fetchReply: true });
};

const add_reactions = async (message) => {
  await message.react("🟢"); // Attending
  await message.react("🔴"); // Not attending
};

const handle_reaction_add = async (reaction, user, message_id, title) => {
  if (user.bot || reaction.message.id !== message_id) return;

  const event = get_event(message_id);
  if (!event) return;

  const embed = reaction.message.embeds[0];

  // Remove previous reaction if user has reacted with multiple emojis
  const user_reactions = reaction.message.reactions.cache.filter((r) => r.users.cache.has(user.id));
  if (user_reactions.size > 1) {
    for (const user_reaction of user_reactions.values()) {
      if (user_reaction.emoji.name !== reaction.emoji.name) {
        await user_reaction.users.remove(user.id);
      }
    }
  }

  if (reaction.emoji.name === "🟢") {
    add_to_event(message_id, user.username, ATTEND_LIMIT);
  } else if (reaction.emoji.name === "🔴") {
    remove_from_event(message_id, user.username);
  }

  await update_event_message(reaction.message, embed, message_id);
};

const handle_reaction_remove = async (reaction, user, message_id) => {
  if (user.bot || reaction.message.id !== message_id) return;

  const event = get_event(message_id);
  if (!event) return;

  const embed = reaction.message.embeds[0];

  if (reaction.emoji.name === "🟢") {
    remove_from_event(message_id, user.id);
  }

  await update_event_message(reaction.message, embed, message_id);
};
