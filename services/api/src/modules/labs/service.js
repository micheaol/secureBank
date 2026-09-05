const labsModel = require("./model");
const challengesModel = require("../challenges/model");
const { ApplicationError } = require("../../utils/apiResponse");

async function listLabsWithProgressForUser(userId) {
  const labs = await labsModel.findAllLabs();

  return Promise.all(
    labs.map(async (lab) => {
      const solvedCount = await challengesModel.countSolvedChallengesForUserInLab(userId, lab.id);
      return {
        code: lab.code,
        name: lab.name,
        description: lab.description,
        totalChallenges: lab._count.challenges,
        solvedChallenges: solvedCount,
      };
    })
  );
}

async function getLabByCode(labCode) {
  const lab = await labsModel.findLabByCode(labCode);
  if (!lab) {
    throw new ApplicationError("Lab not found.", 404);
  }
  return { code: lab.code, name: lab.name, description: lab.description, totalChallenges: lab._count.challenges };
}

module.exports = {
  listLabsWithProgressForUser,
  getLabByCode,
};
