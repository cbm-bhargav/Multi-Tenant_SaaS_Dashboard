/*
  Warnings:

  - You are about to drop the column `neonProjectId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Project` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Project_neonProjectId_key";

-- AlterTable
ALTER TABLE "public"."Project" DROP COLUMN "neonProjectId",
DROP COLUMN "updatedAt";
