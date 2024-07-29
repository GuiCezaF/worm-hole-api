/*
  Warnings:

  - Added the required column `content_type` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "content_type" TEXT NOT NULL,
ADD COLUMN     "key" TEXT NOT NULL;
