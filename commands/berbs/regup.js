import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { add_to_event, get_event, get_recent_event_id, update_event_message } from "./db_events.js";

export const command = {
  data: new SlashCommandBuilder().setName("regup").setDescription("regup"),
  async execute(interaction) {
    const recent_event_id = get_recent_event_id(interaction.channelId);
    const channel = interaction.channel;

    try {
      const recent_event_message = await channel.messages.fetch(recent_event_id);
      console.log("recent_event_message", recent_event_message);

      if (!recent_event_message) {
        await interaction.reply({ content: "i dunno what event you're talking about. try using reactions on it?", ephemeral: true });
        return;
      }

      // Check if the user has reacted with the "Denied" emoji
      const deniedReaction = recent_event_message.reactions?.cache.find(
        (r) => r.emoji.name === "🔴" && r.users.cache.has(interaction.user.id)
      );
      if (deniedReaction) {
        await interaction.reply({ content: "FAIL! you put 🔴 on the event, go remove that before I add you", ephemeral: true });
        return;
      }

      const ATTEND_LIMIT = 14;
      const result = add_to_event(recent_event_id, interaction.user.username, ATTEND_LIMIT);
      console.log("result", result);

      if (!result) {
        await interaction.reply({ content: "i can't access that event. try using reactions on it?", ephemeral: true });
        return;
      }

      if (result.status === "attending") {
        await interaction.reply({ content: "gotchu", ephemeral: true });
      } else if (result.status === "waitlist") {
        await interaction.reply({ content: "its full dawg, added you to waitlist", ephemeral: true });
      }

      const embed = recent_event_message.embeds[0];
      await update_event_message(recent_event_message, embed, recent_event_id);
    } catch (error) {
      console.error("Error fetching recent event message:", error);
      await interaction.reply({ content: "that event is too old (or i just rebooted oops). it needs to be recreated", ephemeral: true });
    }
  },
};
