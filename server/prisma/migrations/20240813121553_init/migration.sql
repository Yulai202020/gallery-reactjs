/*
  Warnings:

  - You are about to drop the column `filename` on the `Images` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Images" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "alt" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "username" TEXT NOT NULL
);
INSERT INTO "new_Images" ("alt", "id", "subject", "username") SELECT "alt", "id", "subject", "username" FROM "Images";
DROP TABLE "Images";
ALTER TABLE "new_Images" RENAME TO "Images";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
