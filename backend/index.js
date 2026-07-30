import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "./generated/prisma/client.ts";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/packs", async (req, res) => {
  const group = req.query.group || "Groep 7";
  const packs = await prisma.wordPack.findMany({
    where: { group },
    include: { _count: { select: { pairs: true } } },
  });
  res.json(
    packs.map((p) => ({ id: p.id, name: p.name, group: p.group, pairCount: p._count.pairs }))
  );
});

app.get("/packs/:id", async (req, res) => {
  const pack = await prisma.wordPack.findUnique({
    where: { id: Number(req.params.id) },
    include: { pairs: { select: { id: true, english: true, dutch: true } } },
  });
  if (!pack) return res.status(404).json({ error: "Pakket niet gevonden" });
  res.json(pack);
});

app.get("/scores", async (req, res) => {
  const scores = await prisma.scoreResult.findMany({
    include: { pack: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(scores);
});

app.post("/scores", async (req, res) => {
  const {
    playerName,
    packId,
    direction,
    totalWords,
    firstTryCorrect,
    accuracy,
    mistakes,
    timeSeconds,
    wpm,
    bestStreak,
    stars,
  } = req.body;
  const score = await prisma.scoreResult.create({
    data: {
      playerName,
      packId,
      direction,
      totalWords,
      firstTryCorrect,
      accuracy,
      mistakes,
      timeSeconds,
      wpm,
      bestStreak,
      stars,
    },
    include: { pack: { select: { name: true } } },
  });
  res.status(201).json(score);
});

app.listen(port, () => {
  console.log(`Backend luistert op http://localhost:${port}`);
});
