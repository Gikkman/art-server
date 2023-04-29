import { createWriteStream, mkdirSync, mkdtempSync, PathLike } from "fs";
import { mkdtemp, readFile, unlink } from "fs/promises";
import { dirname, join } from "path";
import { createHash } from 'crypto';
import { promisify } from 'util';
import axios from "axios";
import stream from "stream";
import { tmpdir } from "os";
import decompress from "decompress";

const finished = promisify(stream.finished);

const fileAddress = "https://mtgjson.com/api/v5/AllPrintings.sqlite.zip";
const fileHashAddress = "https://mtgjson.com/api/v5/AllPrintings.sqlite.zip.sha256"

async function unzip(input: string, outputDir: string, outputFile: string): Promise<void> {
    await decompress(input, outputDir, {map: file => {
        file.path = outputFile
        return file
    }})
}

async function fetchFile(downloadDir: string) {
    const file = join(downloadDir, "AllPrintings.sqlite.zip");
    const outputStream = createWriteStream(file);
    await axios({
        method: "get",
        url: fileAddress,
        responseType: "stream",
    }).then(stream => {
        stream.data.pipe(outputStream)
        return finished(outputStream);
    })
    return file;
}

async function hashFile(input: PathLike) {
    const buff = await readFile(input);
    return createHash("sha256").update(buff).digest("hex")
}

async function getHashFromServer() {
    const response = await axios({
        method: "get",
        url: fileHashAddress,
        responseType: "text"
    })
    return response.data
}

async function ensureDir(dir: string) {
    const dirName = dirname(dir);
    mkdirSync(dirName, {recursive: true})
}

const downloadDir = process.env.DOWNLOAD_DIR || mkdtempSync("mtg-json-");
const unzipDir = process.env.DATA_DIR || './_data'
fetchFile(downloadDir)
    .then(async file => {
        const localFileHash = await hashFile(file)
        const remoteHash = await getHashFromServer()
        if( localFileHash !== remoteHash ) throw `Error: Hash missmatch! Remote: ${remoteHash} Local: ${localFileHash}` 
        await ensureDir(unzipDir)
        const unzipLocation = "AllPrintings-"+Math.floor(new Date().getTime() / 1000)+".sqlite"
        await unzip(file, unzipDir, unzipLocation)
        unlink(file)
        console.log(unzipLocation)
    })
    .catch(ex => {
        console.error(ex)
    })
