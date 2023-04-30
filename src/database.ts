import { readdir } from "fs/promises";
import Database from "better-sqlite3";
import path from "path";
import { Card } from "./types";

export async function getDb() {
    const file = (await readdir('_data')).sort().find(e => e.endsWith('.sqlite'))
    if(!file) throw "No sqlite file found in _data folder";
    const location = path.join(".", "_data", file)
    return new Database(location, {readonly: true});
}

export async function getCardDataByName(cardName: string): Promise<Card[]> {
    const db = await getDb()
    const query = `
      SELECT 
        scryfallIllustrationId, 
        scryfallId, 
        name,
        setCode,
        number as collectorNumber
      FROM 
        cards
      WHERE 
        (name = ? COLLATE NOCASE OR faceName = ? COLLATE NOCASE)
    `;
    const params = [cardName, cardName];
    const cards: Card[] = db.prepare(query).all(params) as Card[];
    db.close();

    return filterToUniqueArt(cards);
}

export async function getCardDataByNameAndSet(setCode: string, cardName: string): Promise<Card[]> {
    const db = await getDb()
    const query = `
      SELECT 
        scryfallIllustrationId, 
        scryfallId, 
        name,
        setCode,
        number as collectorNumber
      FROM 
        cards
      WHERE 
        setCode = ? COLLATE NOCASE
        AND 
        (name = ? COLLATE NOCASE OR faceName = ? COLLATE NOCASE)
    `;
    const params = [setCode, cardName, cardName];
    const cards: Card[] = db.prepare(query).all(params) as Card[];
    db.close();

    return filterToUniqueArt(cards);
}

export async function getCardDataBySetAndNumber(setCode: string, number: string) {
    const db = await getDb()
    const query = `
      SELECT 
        scryfallIllustrationId, 
        scryfallId, 
        name,
        setCode,
        number as collectorNumber
      FROM 
        cards
      WHERE 
        setCode = ? COLLATE NOCASE 
        AND 
        number = ? COLLATE NOCASE
    `;
    const params = [setCode, number];
    const cards: Card[] = db.prepare(query).all(params) as Card[];
    db.close();

    return filterToUniqueArt(cards);
}

function filterToUniqueArt(cards: Card[]) {
    const seenArt = new Set<string>();
    return cards.filter(e => { 
        if( seenArt.has(e.scryfallIllustrationId) ) return false;
        seenArt.add(e.scryfallIllustrationId);
        return true;
    })
}