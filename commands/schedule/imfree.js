import { SlashCommandBuilder } from "discord.js";
import { prettySchedule } from "../../utils/utils.js";

export const command = {
  data: new SlashCommandBuilder()
    .setName("imfree")
    .setDescription("set your availability schedule")
    .addStringOption((option) =>
      option.setName("schedule").setDescription("describe your availability in natural language").setRequired(true)
    ),
  async execute(interaction, gpt) {
    // let schedule = interaction.options.getString("schedule");
    // let json = await gpt.schedulify(schedule);
    // await interaction.reply(JSON.stringify(json, null, 2));

    await interaction.deferReply();
    let schedule = interaction.options.getString("schedule");
    let json = await gpt.schedulify(schedule);

    let pretty = prettySchedule(json);
    // let json_md = `\`\`\`json\n${json}\n\`\`\``;

    const reply = `based on the input: \`${schedule}\`\n\nyour schedule has been set to:`;
    await interaction.editReply({ content: reply, embeds: [pretty] });
  },
};
