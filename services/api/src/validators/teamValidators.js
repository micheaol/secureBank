const { z } = require("zod");

const joinTeamRequestSchema = z.object({
  teamName: z.string().trim().min(2, "Enter a team name.").max(60),
});

module.exports = { joinTeamRequestSchema };
