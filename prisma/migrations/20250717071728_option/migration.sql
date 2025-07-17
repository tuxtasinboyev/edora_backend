/*
  Warnings:

  - Made the column `experience` on table `MentorProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "MentorProfile" ALTER COLUMN "experience" SET NOT NULL;
