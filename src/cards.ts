import fetch from "node-fetch";
import { Card, CardImage, MultiFaceCard, ScryfallCard, SingleFaceCard, isSingleFaced, isTwoFaced } from "./types";

export async function getCardImages(cards: Card[]) {
    const responses: CardImage[] = [];
    for (const card of cards) {
        const url = `https://api.scryfall.com/cards/${card.scryfallId}/?format=json&include_extras=true&include_multilingual=true&pretty=true`;
        const response = await fetch(url);
        const data: ScryfallCard = await response.json() as ScryfallCard;
        if(isTwoFaced(data)) {
            responses.push(...handleMultiFaceCards(data))
        }
        else if(isSingleFaced(data)) {
            responses.push(handleSingleFaceCards(data));
        }
        else {
            throw "Unknown card data returned: " + JSON.stringify(data);
        }
        await new Promise(res => setTimeout(res, 100));
    }
    return responses;
}

function handleSingleFaceCards(card: SingleFaceCard): CardImage {
    return {
        name: card.name,
        imageUrl: card.image_uris.normal,
        illustrationId: card.illustration_id
    }
}

function handleMultiFaceCards(card: MultiFaceCard): [CardImage, CardImage] {
    const faceA = card.card_faces[0];
    const faceB = card.card_faces[1];
    
    const outA: Partial<CardImage> = {name: faceA.name};
    const outB: Partial<CardImage> = {name: faceB.name};

    // Sometimes, the "image_uris" are on the base card. This is usually for
    // split cards such as 'Far // Away' or 'Commit // Memory'
    // In those cases, the illustration_id is found on face A
    if(card.image_uris) {
        outA.illustrationId = faceA.illustration_id+"-A"
        outB.illustrationId = faceA.illustration_id+"-B"

        outA.imageUrl = card.image_uris.normal
        outB.imageUrl = card.image_uris.normal

        return [outA as CardImage, outB as CardImage];
    }

    // In other cases, we're dealing with transform or mdfc cards, such as
    // Bala Ged Recovery or Mayor of Avabruck
    if(faceA.image_uris && faceA.illustration_id && faceB.image_uris && faceB.illustration_id) {
        outA.illustrationId = faceA.illustration_id
        outA.imageUrl = faceA.image_uris.normal
        
        outB.illustrationId = faceB.illustration_id
        outB.imageUrl = faceB.image_uris.normal

        return [outA as CardImage, outB as CardImage];
    }
    
    throw "Unknown card configuration: " + JSON.stringify(card);
}