import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import {
  get_event,
  set_event,
  add_to_event,
  remove_from_event,
  set_latest_channel_event,
  update_event_message,
  ATTEND_LIMIT,
} from "./db_events.js";

const AUTHORIZED_USER_IDS = [process.env.user_id];

export const command = {
  data: new SlashCommandBuilder()
    .setName("makeberbs")
    .setDescription("generate signup for berbs")
    .addStringOption((option) => option.setName("img").setDescription("the thumbnail for the event").setRequired(true)),

  async execute(interaction, client) {
    if (!is_authorized(interaction.user.id, AUTHORIZED_USER_IDS)) {
      await interaction.reply({ content: "you're not my dad!", ephemeral: true });
      return;
    }

    const title = generate_event_title();
    const img = interaction.options.getString("img");
    const event_message = await create_event_message(interaction, title, img);

    await add_reactions(event_message);

    set_event(event_message.id, interaction.channelId);
    set_latest_channel_event(interaction.channelId, event_message.id);

    client.on("messageReactionAdd", (reaction, user) => handle_reaction_add(reaction, user, event_message.id, title));
    client.on("messageReactionRemove", (reaction, user) => handle_reaction_remove(reaction, user, event_message.id));
  },
};

const is_authorized = (user_id, authorized_ids) => authorized_ids.includes(user_id);

const generate_event_title = () => `berbs #${100 + Math.floor(Math.random() * 200)}`;

const create_event_message = async (interaction, title, img) => {
  const embed = new EmbedBuilder()
    .setColor(0x00ff00)
    .setTitle(title)
    .setDescription(
      "\nbracket start: 7:30pm\ncome after: 6:00pm\n\nif you don't reg and we hit cap i reserve the right to kick you out into the yard with jade\n🟢 Attending | 🔴 Not Attending"
    )
    .addFields({ name: "Current Attendees:", value: "None" }, { name: "Spots Filled:", value: `0/${ATTEND_LIMIT}` });

  if (img) {
    embed.setImage(img);
  }

  return await interaction.reply({ embeds: [embed], fetchReply: true });
};

const add_reactions = async (message) => {
  await message.react("🟢");
  await message.react("🔴");
};

const handle_reaction_add = async (reaction, user, message_id) => {
  if (user.bot || reaction.message.id !== message_id) return;

  const event = get_event(message_id);
  if (!event) return;

  const embed = reaction.message.embeds[0];

  // remove old reactions
  const user_reactions = reaction.message.reactions.cache.filter((r) => r.users.cache.has(user.id));
  if (user_reactions.size > 1) {
    for (const user_reaction of user_reactions.values()) {
      if (user_reaction.emoji.name !== reaction.emoji.name) {
        await user_reaction.users.remove(user.id);
      }
    }
  }

  if (reaction.emoji.name === "🟢") {
    add_to_event(message_id, user, ATTEND_LIMIT);
  } else if (reaction.emoji.name === "🔴") {
    let waitlist_invite = remove_from_event(message_id, user);
    if (waitlist_invite) {
      waitlist_invite.send(`a spot opened up. you're added to berbs! 🎉`);
    }
  }

  await update_event_message(reaction.message, embed, message_id);
};

const handle_reaction_remove = async (reaction, user, message_id) => {
  if (user.bot || reaction.message.id !== message_id) return;

  const event = get_event(message_id);
  if (!event) return;

  const embed = reaction.message.embeds[0];

  if (reaction.emoji.name === "🟢") {
    let waitlist_invite = remove_from_event(message_id, user);
    if (waitlist_invite) {
      waitlist_invite.send(`a spot opened up. you're added to berbs! 🎉`);
    }
  }

  await update_event_message(reaction.message, embed, message_id);
};
