import { Card, CardImage, DOUBLE_FRONT_LAYOUT, FRONT_BACK_LAYOUT, SPLIT_LAYOUT, isIn } from "./../../types/CardTypes";
import Database from "better-sqlite3";
import path from "path";
import { readdir } from "fs/promises";
import { DATA_DIR } from "./const";
import { isArtAvailable } from "./local-database";

export function mtgJsonDir() {
  return path.join(DATA_DIR, "mtgjson");
}

async function getDb() {
  // Find the newest database file
  const dir = mtgJsonDir();
  const file = (await readdir(dir))
    .sort()
    .reverse()
    .find((e) => e.endsWith(".sqlite"));
  if (!file) throw "No sqlite file found in _data folder";
  const location = path.join(dir, file);
  return new Database(location);
}

const BASE_QUERY = `
SELECT
  name,
  setCode,
  number as collectorNumber,
  scryfallId, 
  scryfallIllustrationId, 
  faceName,
  layout,
  side,
  uuid,
  otherFaceIds,
  releaseDate
FROM 
  cards c
JOIN (SELECT code, releaseDate FROM sets) s ON c.setCode = s.code
`;
const GROUP_BY = `
GROUP BY name, side, scryfallIllustrationId
HAVING min(releaseDate)
ORDER BY releaseDate
`;

export async function query(name: string): Promise<string[]> {
  const db = await getDb();
  db.exec(`PRAGMA case_sensitive_like=OFF`);
  const query = `SELECT name FROM cards WHERE name LIKE ? GROUP BY name`;
  const rows = db.prepare(query).all(name + "%") as string[];
  return rows;
}

export async function getCardDataByName(cardName: string): Promise<CardImage[]> {
  const db = await getDb();
  const query = `
      ${BASE_QUERY}
      WHERE 
        (name = ? COLLATE NOCASE OR faceName = ? COLLATE NOCASE)
      ${GROUP_BY}
    `;
  const params = [cardName, cardName];
  const s = Date.now();
  const cards: Card[] = db.prepare(query).all(params) as Card[];
  console.log("Query time: " + (Date.now() - s));

  db.close();
  return processCards(cards);
}

export async function getCardDataByNameAndSet(setCode: string, cardName: string): Promise<CardImage[]> {
  const db = await getDb();
  const query = `
      ${BASE_QUERY}
      WHERE 
        setCode = ? COLLATE NOCASE
        AND 
        (name = ? COLLATE NOCASE OR faceName = ? COLLATE NOCASE)
      ${GROUP_BY}
    `;
  const params = [setCode, cardName, cardName];
  const s = Date.now();
  const cards: Card[] = db.prepare(query).all(params) as Card[];
  console.log("Query time: " + (Date.now() - s));

  db.close();
  return processCards(cards);
}

export async function getCardDataBySetAndNumber(setCode: string, number: string) {
  const db = await getDb();
  const query = `
      ${BASE_QUERY}
      WHERE 
        setCode = ? COLLATE NOCASE 
        AND 
        number = ? COLLATE NOCASE
      ${GROUP_BY}
    `;
  const params = [setCode, number];
  const s = Date.now();
  const cards: Card[] = db.prepare(query).all(params) as Card[];
  console.log("Query time: " + (Date.now() - s));

  db.close();
  return processCards(cards);
}

async function queryOtherFace(uuid: string) {
  const db = await getDb();
  const query = `
      ${BASE_QUERY}
      WHERE
        uuid = ?
      ${GROUP_BY}
    `;
  const params = [uuid];
  const cards: Card[] = db.prepare(query).all(params) as Card[];

  db.close();
  return cards[0];
}

async function processCards(cards: Card[]) {
  const s = Date.now();
  type Copy = Card & { otherFace?: Card };
  const uuidMap: Map<string, Card> = new Map();
  const map: Map<string, Copy> = new Map();

  for (const card of cards) {
    uuidMap.set(card.uuid, card);
  }

  for (const card of cards) {
    const copy: Copy = { ...card };
    if (map.has(card.scryfallIllustrationId)) continue;

    if (card.otherFaceIds) {
      const otherFace = uuidMap.get(card.otherFaceIds) ?? (await queryOtherFace(card.otherFaceIds));
      copy["otherFace"] = otherFace;
    }
    map.set(card.scryfallIllustrationId, copy);
  }

  // Sometimes there are duplicate entries
  const filterMap: Map<string, CardImage> = new Map();
  const addToMap = (...c: CardImage[]) => c.forEach((e) => filterMap.set(e.illustrationId, e));
  for (const card of map.values()) {
    if (card.otherFace && isIn(FRONT_BACK_LAYOUT, card.layout)) {
      // Two faces, with different art (i.e. transform, mdfc)
      const front = card.side === "a" ? card : card.otherFace;
      const back = card.side === "b" ? card : card.otherFace;
      const faceA = toCardImage(front, true);
      const faceB = toCardImage(back, false);
      addToMap(faceA, faceB);
    } else if (card.otherFace && isIn(SPLIT_LAYOUT, card.layout)) {
      // Two faces, but with same art (i.e. split, flip, aftermath)
      // At least it is "one art" according to scryfall, but for our purpose we see them as two
      card.scryfallIllustrationId = card.scryfallIllustrationId + "-" + card.side;
      card.otherFace.scryfallIllustrationId = card.otherFace.scryfallIllustrationId + "-" + card.otherFace.side;
      const faceA = toCardImage(card, true);
      const faceB = toCardImage(card.otherFace, true);
      faceA.hasOtherFace = true;
      faceB.hasOtherFace = true;
      addToMap(faceA, faceB);
    } else if (card.otherFace && isIn(DOUBLE_FRONT_LAYOUT, card.layout)) {
      // Two faces, but both are considered "front" faces (only for meld cards at the moment)
      const front = card.side === "a" ? card : card.otherFace;
      const back = card.side === "b" ? card : card.otherFace;
      const faceA = toCardImage(front, true);
      const faceB = toCardImage(back, true);
      addToMap(faceA, faceB);
    } else {
      // Single face
      const face = toCardImage(card, true);
      addToMap(face);
    }
  }

  const ret: CardImage[] = [...filterMap.values()];
  const artAvailability = isArtAvailable(...ret.map((e) => e.illustrationId));
  for (const r of ret) {
    const artState = artAvailability.get(r.illustrationId);
    r.available = artState === "AVAILABLE";
  }

  console.log("Process time: " + (Date.now() - s));
  return ret;
}

function toCardImage(card: Card, front: boolean): CardImage {
  const fileFace = front ? "front" : "back";
  const fileType = "normal";
  const fileFormat = "jpg";
  const fileName = card.scryfallId;
  const dir1 = fileName.charAt(0);
  const dir2 = fileName.charAt(1);
  const imageUrl = `https://cards.scryfall.io/${fileType}/${fileFace}/${dir1}/${dir2}/${fileName}.${fileFormat}`;

  return {
    name: card.faceName ?? card.name,
    illustrationId: card.scryfallIllustrationId,
    imageUrl,
    available: false,
  };
}
