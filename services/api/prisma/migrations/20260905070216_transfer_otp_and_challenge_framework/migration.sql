-- CreateEnum
CREATE TYPE "ChallengeDifficulty" AS ENUM ('EXPLORER', 'ENGINEER', 'SPECIALIST');

-- CreateEnum
CREATE TYPE "ChallengeStatus" AS ENUM ('LOCKED', 'AVAILABLE', 'ACTIVE', 'SOLVED');

-- CreateEnum
CREATE TYPE "ChallengeFlagState" AS ENUM ('VULNERABLE', 'PATCHED');

-- CreateEnum
CREATE TYPE "EnvironmentStatus" AS ENUM ('PROVISIONING', 'RUNNING', 'EXPIRED', 'TERMINATED', 'UNHEALTHY');

-- AlterTable
ALTER TABLE "transfers" ADD COLUMN     "otpAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "otpExpiresAt" TIMESTAMP(3),
ADD COLUMN     "otpTokenHash" TEXT;

-- CreateTable
CREATE TABLE "labs" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "labs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenges" (
    "id" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "difficulty" "ChallengeDifficulty" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "scenario" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "learningObjective" TEXT NOT NULL,
    "prerequisites" TEXT,
    "startingState" TEXT,
    "expectedSecurityBoundary" TEXT,
    "intendedWeakness" TEXT NOT NULL,
    "validationType" TEXT NOT NULL DEFAULT 'automated',
    "points" INTEGER NOT NULL,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "remediationGuide" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenge_hints" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "cost" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "challenge_hints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenge_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "status" "ChallengeStatus" NOT NULL DEFAULT 'LOCKED',
    "flagState" "ChallengeFlagState" NOT NULL DEFAULT 'VULNERABLE',
    "hintsRevealed" INTEGER NOT NULL DEFAULT 0,
    "pointsAwarded" INTEGER NOT NULL DEFAULT 0,
    "evidence" JSONB,
    "submittedAnswer" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "solvedAt" TIMESTAMP(3),
    "remediatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenge_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "environments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "status" "EnvironmentStatus" NOT NULL DEFAULT 'PROVISIONING',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "environments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_memberships" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_achievements" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "score_events" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "challengeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "score_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "labs_code_key" ON "labs"("code");

-- CreateIndex
CREATE UNIQUE INDEX "challenges_code_key" ON "challenges"("code");

-- CreateIndex
CREATE INDEX "challenges_labId_idx" ON "challenges"("labId");

-- CreateIndex
CREATE INDEX "challenge_hints_challengeId_idx" ON "challenge_hints"("challengeId");

-- CreateIndex
CREATE INDEX "challenge_progress_challengeId_idx" ON "challenge_progress"("challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "challenge_progress_userId_challengeId_key" ON "challenge_progress"("userId", "challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "environments_externalId_key" ON "environments"("externalId");

-- CreateIndex
CREATE INDEX "environments_userId_idx" ON "environments"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "teams_name_key" ON "teams"("name");

-- CreateIndex
CREATE UNIQUE INDEX "team_memberships_userId_key" ON "team_memberships"("userId");

-- CreateIndex
CREATE INDEX "team_memberships_teamId_idx" ON "team_memberships"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "achievements_code_key" ON "achievements"("code");

-- CreateIndex
CREATE UNIQUE INDEX "user_achievements_userId_achievementId_key" ON "user_achievements"("userId", "achievementId");

-- CreateIndex
CREATE INDEX "score_events_userId_idx" ON "score_events"("userId");

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_labId_fkey" FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_hints" ADD CONSTRAINT "challenge_hints_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_progress" ADD CONSTRAINT "challenge_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_progress" ADD CONSTRAINT "challenge_progress_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environments" ADD CONSTRAINT "environments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environments" ADD CONSTRAINT "environments_labId_fkey" FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_memberships" ADD CONSTRAINT "team_memberships_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_memberships" ADD CONSTRAINT "team_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "achievements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "score_events" ADD CONSTRAINT "score_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
