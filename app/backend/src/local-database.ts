import path from "path";
import { DATA_DIR, WORK_DIR } from "./const";
import Database from "better-sqlite3";
import { existsSync, mkdirSync, readFileSync } from "fs";
import { ART_STATE_MAPPING, ArtState, toArtState } from "../../types/CardTypes";

type DB = ReturnType<typeof Database>;

function getDb() {
  const file = "local.sqlite";
  const dir = path.join(DATA_DIR);
  const location = path.join(dir, file);
  if (!existsSync(location)) {
    mkdirSync(dir, { recursive: true });
    return initDb(new Database(location));
  }
  return new Database(location);
}

function initDb(db: DB) {
  const structureSqlPath = path.join(WORK_DIR, "sql", "001-structure.sql");
  const structureSql = readFileSync(structureSqlPath, "utf-8");
  db.exec(structureSql);

  const dataSqlPath = path.join(WORK_DIR, "sql", "002-data.sql");
  const dataSql = readFileSync(dataSqlPath, "utf-8");
  db.exec(dataSql);

  return db;
}

type ArtStateRow = { scryfallIllustrationId: string; state: string };
export function isArtAvailable(...scryfallIllustrationIds: string[]): Map<string, ArtState> {
  const db = getDb();
  const query = `
    SELECT scryfallIllustrationId, state 
    FROM art a 
    JOIN art_state s 
        ON a.state_id = s.id  
    WHERE a.scryfallIllustrationId=?
  `;
  const stmt = db.prepare(query);
  const map: Map<string, ArtState> = new Map();
  for (const id of scryfallIllustrationIds) {
    const row = stmt.get(id) as ArtStateRow;
    if (row && typeof row === "object" && "state" in row && "scryfallIllustrationId" in row) {
      map.set(id, toArtState(row.state));
    }
  }
  db.close();
  return map;
}

export function updateArtAvailability(scryfallIllustrationId: string, newState: ArtState) {
  const stateId = ART_STATE_MAPPING[newState];
  const sql = "INSERT INTO art (scryfallIllustrationId, state_id) VALUES (?,?)";
  const db = getDb();
  db.prepare(sql).get(scryfallIllustrationId, stateId);
  db.close();
}
