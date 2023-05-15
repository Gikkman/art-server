import { PathLike, createWriteStream, mkdirSync, readdirSync } from "fs";
import { readFile, rmdir, unlink, rm } from "fs/promises";
import { join } from "path";
import { createHash } from "crypto";
import { promisify } from "util";
import axios from "axios";
import stream from "stream";
import decompress from "decompress";
import Database from "better-sqlite3";
import { mtgJsonDir } from "./mtg-json-database";
import { sleep } from "./util";

const finished = promisify(stream.finished);

const fileAddress = "https://mtgjson.com/api/v5/AllPrintings.sqlite.zip";
const fileHashAddress = "https://mtgjson.com/api/v5/AllPrintings.sqlite.zip.sha256";

async function unzip(input: string, outputDir: string, outputFile: string): Promise<void> {
  await decompress(input, outputDir, {
    map: (file) => {
      file.path = outputFile;
      return file;
    },
  });
}

async function fetchFile(downloadDir: string) {
  const file = join(downloadDir, "AllPrintings.sqlite.zip");
  const outputStream = createWriteStream(file);
  await axios({
    method: "get",
    url: fileAddress,
    responseType: "stream",
  }).then((stream) => {
    stream.data.pipe(outputStream);
    return finished(outputStream);
  });
  return file;
}

async function hashFile(input: PathLike) {
  const buff = await readFile(input);
  return createHash("sha256").update(buff).digest("hex");
}

async function getHashFromServer() {
  const response = await axios({
    method: "get",
    url: fileHashAddress,
    responseType: "text",
  });
  return response.data;
}

async function ensureDir(dir: string) {
  mkdirSync(dir, { recursive: true });
}

export async function runDownload() {
  const dataDir = mtgJsonDir();
  ensureDir(dataDir);
  const downloadDir = join(dataDir, "dl-" + Math.floor(new Date().getTime() / 1000));
  ensureDir(downloadDir);

  await fetchFile(downloadDir)
    .then(async (file) => {
      const localFileHash = await hashFile(file);
      const remoteHash = await getHashFromServer();
      if (localFileHash !== remoteHash) {
        throw `Error: Hash mismatch! Remote: ${remoteHash} Local: ${localFileHash}`;
      }
      return file;
    })
    .then(async (file) => {
      const unzippedFileName = "AllPrintings-" + Math.floor(new Date().getTime() / 1000) + ".sqlite";
      await unzip(file, dataDir, unzippedFileName);
      await unlink(file);
      await rmdir(downloadDir);
      console.log("Unpacked to: " + unzippedFileName);
      return unzippedFileName;
    })
    .then(async (dbFile) => {
      console.log("Creating indexes for db " + dbFile);
      const dbPath = join(dataDir, dbFile);
      const db = new Database(dbPath, {});
      db.prepare("CREATE INDEX IF NOT EXISTS idx_cards_name ON cards(name COLLATE NOCASE)").run();
      db.prepare("CREATE INDEX IF NOT EXISTS idx_cards_number ON cards(number COLLATE NOCASE)").run();
      db.prepare("CREATE INDEX IF NOT EXISTS idx_cards_set ON cards(setCode COLLATE NOCASE)").run();
      db.prepare("CREATE INDEX IF NOT EXISTS idx_cards_face ON cards(faceName COLLATE NOCASE)").run();
      db.close();
      console.log("Indexes created");

      return dbFile;
    })
    .then(async (newFile) => {
      sleep(1000 * 60 * 5).then(() => deleteOldMtgJsonFiles(newFile));
    })
    .catch((ex) => {
      console.error(ex);
    });
}

export async function downloadIfNotPresent() {
  const dataDir = mtgJsonDir();
  ensureDir(dataDir);

  const dbExists = readdirSync(dataDir).filter((e) => e.endsWith(".sqlite")).length > 0;
  if (dbExists) {
    console.log("An mtg-json file was already downloaded. Skipping download on startup.");
    return;
  }

  console.log("No mtg-json file was found. Download before startup.");
  return await runDownload();
}

async function deleteOldMtgJsonFiles(dbFileToKeep: string) {
  const dir = mtgJsonDir();
  const files = readdirSync(dir, { withFileTypes: true });
  console.log("Cleaning out all db files except " + dbFileToKeep);
  files
    .filter((e) => e.isFile())
    .filter((e) => !e.name.startsWith(dbFileToKeep))
    .forEach((e) => {
      console.log("Deleting file: " + e.name);
      const fileToDelete = join(dir, e.name);
      unlink(fileToDelete);
    });
  files
    .filter((e) => e.isDirectory())
    .forEach((e) => {
      console.log("Deleting folder: " + e.name);
      const folderToDelete = join(dir, e.name);
      rm(folderToDelete, { force: true, recursive: true });
    });
}
