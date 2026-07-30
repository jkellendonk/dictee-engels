-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WordPack" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "group" TEXT NOT NULL DEFAULT 'Groep 7',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_WordPack" ("createdAt", "id", "name") SELECT "createdAt", "id", "name" FROM "WordPack";
DROP TABLE "WordPack";
ALTER TABLE "new_WordPack" RENAME TO "WordPack";
CREATE UNIQUE INDEX "WordPack_name_group_key" ON "WordPack"("name", "group");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
