-- CreateTable
CREATE TABLE "WordPack" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "WordPair" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "packId" INTEGER NOT NULL,
    "english" TEXT NOT NULL,
    "dutch" TEXT NOT NULL,
    CONSTRAINT "WordPair_packId_fkey" FOREIGN KEY ("packId") REFERENCES "WordPack" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ScoreResult" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playerName" TEXT NOT NULL,
    "packId" INTEGER NOT NULL,
    "direction" TEXT NOT NULL,
    "totalWords" INTEGER NOT NULL,
    "firstTryCorrect" INTEGER NOT NULL,
    "accuracy" INTEGER NOT NULL,
    "mistakes" INTEGER NOT NULL,
    "timeSeconds" INTEGER NOT NULL,
    "wpm" REAL NOT NULL,
    "bestStreak" INTEGER NOT NULL,
    "stars" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ScoreResult_packId_fkey" FOREIGN KEY ("packId") REFERENCES "WordPack" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "WordPack_name_key" ON "WordPack"("name");
