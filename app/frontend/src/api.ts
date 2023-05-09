import axios from "axios";
import { type Card } from "./types";

export async function autocompleteCards(query: string): Promise<Card[]> {
  const response = await axios.get(`https://api.scryfall.com/cards/autocomplete?q=${query}`);
  return response.data.data.map((name: string) => ({ name }));
}

export async function getCard(cardId: string): Promise<Card> {
  const response = await axios.get(`https://api.scryfall.com/cards/${cardId}`);
  return response.data as Card;
}

export async function autoComplete(query: string) {
  return "." + query;
}

const MTG_API_URL = "https://api.scryfall.com";
const DEFAULT_PAGE_SIZE = 20;
export async function searchCards(
  query: string,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE
): Promise<Card[]> {
  const response = await fetch(
    `${MTG_API_URL}/cards/search?q=${query}&page=${page}&pageSize=${pageSize}`
  );
  const data = await response.json();
  const cards: Card[] = data.data.map((card: any) => ({
    id: card.id,
    name: card.name,
    imageUrl: card?.image_uris?.normal,
    releaseDate: new Date(card.released_at),
    artist: card.artist,
  }));
  return cards;
}
