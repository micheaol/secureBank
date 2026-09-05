const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { seedLabChallenges } = require("./seeds/labChallenges");

const prismaClient = new PrismaClient();

const SYNTHETIC_ROLE_DEFINITIONS = [
  { name: "customer", description: "Standard banking customer." },
  { name: "support_agent", description: "Handles customer support cases." },
  { name: "operations_user", description: "Performs approved operational functions." },
  { name: "developer", description: "Has access to development repositories and CI/CD." },
  { name: "devops_engineer", description: "Manages pipelines, deployments and infrastructure." },
  { name: "security_engineer", description: "Reviews security findings and telemetry." },
  { name: "administrator", description: "Has privileged application functions." },
  { name: "lab_facilitator", description: "Controls participant exercises." },
  { name: "sandbox_administrator", description: "Controls lab infrastructure and emergency controls." },
];

const DEMO_PASSWORD = "SecureBank!2026";

async function seedRoles() {
  const rolesByName = {};
  for (const roleDefinition of SYNTHETIC_ROLE_DEFINITIONS) {
    const role = await prismaClient.role.upsert({
      where: { name: roleDefinition.name },
      update: {},
      create: roleDefinition,
    });
    rolesByName[role.name] = role;
  }
  return rolesByName;
}

async function seedDemoCustomer(customerRoleId) {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const demoCustomer = await prismaClient.user.upsert({
    where: { email: "ada.okafor@securebank.training" },
    update: {},
    create: {
      fullName: "Ada Okafor",
      email: "ada.okafor@securebank.training",
      phoneNumber: "+2348031234567",
      passwordHash,
      roleId: customerRoleId,
    },
  });

  const currentAccount = await prismaClient.account.upsert({
    where: { accountNumber: "0123456789" },
    update: {},
    create: {
      userId: demoCustomer.id,
      accountNumber: "0123456789",
      accountType: "CURRENT",
      balance: "842310.20",
      availableBalance: "840110.20",
    },
  });

  await prismaClient.account.upsert({
    where: { accountNumber: "0198877342" },
    update: {},
    create: {
      userId: demoCustomer.id,
      accountNumber: "0198877342",
      accountType: "SAVINGS",
      balance: "403510.30",
      availableBalance: "403510.30",
    },
  });

  const syntheticBeneficiaries = [
    { accountName: "Tunde Adebayo", accountNumber: "0044119876", bankName: "GTBank" },
    { accountName: "Amaka Nwosu", accountNumber: "2210447781", bankName: "Zenith Bank" },
    { accountName: "Ibrahim Musa", accountNumber: "0090114522", bankName: "SecureBank" },
    { accountName: "Chidi Okonkwo", accountNumber: "3311220099", bankName: "Access Bank" },
  ];

  for (const beneficiary of syntheticBeneficiaries) {
    const existingBeneficiary = await prismaClient.beneficiary.findFirst({
      where: { userId: demoCustomer.id, accountNumber: beneficiary.accountNumber },
    });
    if (!existingBeneficiary) {
      await prismaClient.beneficiary.create({ data: { userId: demoCustomer.id, ...beneficiary } });
    }
  }

  const syntheticTransactions = [
    { reference: "SB-TRX-482910", type: "DEBIT", status: "SUCCESSFUL", amount: "25000.00", description: "Transfer to Tunde Adebayo", category: "Transfer" },
    { reference: "SB-TRX-482911", type: "DEBIT", status: "SUCCESSFUL", amount: "18500.00", description: "Eko Electricity prepaid", category: "Bill payment" },
    { reference: "SB-TRX-482912", type: "CREDIT", status: "SUCCESSFUL", amount: "612000.00", description: "Salary - Kudi Systems", category: "Salary" },
    { reference: "SB-TRX-482913", type: "DEBIT", status: "SUCCESSFUL", amount: "120000.00", description: "Rent standing order", category: "Standing order" },
    { reference: "SB-TRX-482914", type: "DEBIT", status: "REVERSED", amount: "8000.00", description: "Transfer to Amaka Nwosu", category: "Transfer" },
    { reference: "SB-TRX-482915", type: "DEBIT", status: "PENDING", amount: "2000.00", description: "MTN airtime", category: "Airtime" },
  ];

  for (const transaction of syntheticTransactions) {
    const existingTransaction = await prismaClient.transaction.findUnique({
      where: { reference: transaction.reference },
    });
    if (!existingTransaction) {
      await prismaClient.transaction.create({
        data: { accountId: currentAccount.id, balanceAfter: currentAccount.balance, ...transaction },
      });
    }
  }

  return demoCustomer;
}

async function seedDemoAdministrator(administratorRoleId) {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  return prismaClient.user.upsert({
    where: { email: "admin@securebank.training" },
    update: {},
    create: {
      fullName: "SecureBank Administrator",
      email: "admin@securebank.training",
      passwordHash,
      roleId: administratorRoleId,
    },
  });
}

const LAB_DEFINITIONS = [
  { code: "WEB", name: "Web Application Security", description: "Authentication, authorization, session and input-handling weaknesses in the customer and admin applications.", order: 1 },
  { code: "API", name: "API Security", description: "Broken object/function level authorization, mass assignment and business-flow abuse across SecureBank's APIs.", order: 2 },
  { code: "AI", name: "AI Security", description: "Prompt injection, excessive agency and authorization failures around the SecureBank AI assistant.", order: 3 },
  { code: "DEVSECOPS", name: "DevSecOps", description: "Secrets, pipeline permissions, container and IaC weaknesses in SecureBank's delivery pipeline.", order: 4 },
  { code: "SUPPLY_CHAIN", name: "Software Supply Chain", description: "Dependency, build and artifact-integrity investigation from source to deployed release.", order: 5 },
];

const ACHIEVEMENT_DEFINITIONS = [
  { code: "first_blood", name: "First Blood", description: "Solved your first challenge.", icon: "🩸" },
  { code: "access_controller", name: "Access Controller", description: "Solved every Web Application Security access-control challenge.", icon: "🔐" },
  { code: "api_hunter", name: "API Hunter", description: "Solved every API Security challenge.", icon: "🔌" },
  { code: "secure_coder", name: "Secure Coder", description: "Successfully remediated a Web Application Security finding.", icon: "🧑‍💻" },
  { code: "pipeline_defender", name: "Pipeline Defender", description: "Solved every DevSecOps challenge.", icon: "♾️" },
  { code: "ai_red_teamer", name: "AI Red Teamer", description: "Solved every AI Security challenge.", icon: "🤖" },
  { code: "supply_chain_investigator", name: "Supply Chain Investigator", description: "Solved every Software Supply Chain challenge.", icon: "📦" },
  { code: "remediation_master", name: "Remediation Master", description: "Remediated five findings across any labs.", icon: "🛠️" },
  { code: "securebank_defender", name: "SecureBank Defender", description: "Solved at least one challenge in every lab.", icon: "🛡️" },
];

async function seedLabs() {
  for (const labDefinition of LAB_DEFINITIONS) {
    await prismaClient.lab.upsert({
      where: { code: labDefinition.code },
      update: {},
      create: labDefinition,
    });
  }
}

async function seedAchievements() {
  for (const achievementDefinition of ACHIEVEMENT_DEFINITIONS) {
    await prismaClient.achievement.upsert({
      where: { code: achievementDefinition.code },
      update: {},
      create: achievementDefinition,
    });
  }
}

async function runDatabaseSeed() {
  console.info("Seeding SecureBank synthetic data...");

  const rolesByName = await seedRoles();
  await seedDemoCustomer(rolesByName.customer.id);
  await seedDemoAdministrator(rolesByName.administrator.id);
  await seedLabs();
  await seedAchievements();
  await seedLabChallenges(prismaClient);

  console.info("Seed complete. Demo login: ada.okafor@securebank.training /", DEMO_PASSWORD);
}

runDatabaseSeed()
  .catch((seedError) => {
    console.error("Seeding failed:", seedError);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
