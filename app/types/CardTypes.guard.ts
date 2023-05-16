/*
 * Generated type guards for "CardTypes.ts".
 * WARNING: Do not manually change this file.
 */
import { Card, ScryfallCard, ScryfallImageUris, SingleFaceCard, MultiFaceCard, CardFace, CardImage, ArtState } from "./CardTypes";

export function isCard(obj: unknown): obj is Card {
    const typedObj = obj as Card
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        typeof typedObj["name"] === "string" &&
        typeof typedObj["setCode"] === "string" &&
        typeof typedObj["collectorNumber"] === "string" &&
        typeof typedObj["scryfallId"] === "string" &&
        typeof typedObj["scryfallIllustrationId"] === "string" &&
        (typeof typedObj["faceName"] === "undefined" ||
            typeof typedObj["faceName"] === "string") &&
        (typeof typedObj["layout"] === "undefined" ||
            typeof typedObj["layout"] === "string") &&
        (typeof typedObj["side"] === "undefined" ||
            typedObj["side"] === "a" ||
            typedObj["side"] === "b") &&
        typeof typedObj["uuid"] === "string" &&
        (typeof typedObj["otherFaceIds"] === "undefined" ||
            typeof typedObj["otherFaceIds"] === "string")
    )
}

export function isScryfallCard(obj: unknown): obj is ScryfallCard {
    const typedObj = obj as ScryfallCard
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        typeof typedObj["name"] === "string" &&
        typeof typedObj["id"] === "string" &&
        (typeof typedObj["illustration_id"] === "undefined" ||
            typeof typedObj["illustration_id"] === "string") &&
        (typeof typedObj["image_uris"] === "undefined" ||
            (typedObj["image_uris"] !== null &&
                typeof typedObj["image_uris"] === "object" ||
                typeof typedObj["image_uris"] === "function") &&
            typeof typedObj["image_uris"]["normal"] === "string" &&
            typeof typedObj["image_uris"]["large"] === "string" &&
            typeof typedObj["image_uris"]["png"] === "string" &&
            typeof typedObj["image_uris"]["art_crop"] === "string" &&
            typeof typedObj["image_uris"]["border_crop"] === "string") &&
        (typeof typedObj["card_faces"] === "undefined" ||
            Array.isArray(typedObj["card_faces"]) &&
            typedObj["card_faces"].every((e: any) =>
                isCardFace(e) as boolean
            )) &&
        typeof typedObj["layout"] === "string"
    )
}

export function isScryfallImageUris(obj: unknown): obj is ScryfallImageUris {
    const typedObj = obj as ScryfallImageUris
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        typeof typedObj["normal"] === "string" &&
        typeof typedObj["large"] === "string" &&
        typeof typedObj["png"] === "string" &&
        typeof typedObj["art_crop"] === "string" &&
        typeof typedObj["border_crop"] === "string"
    )
}

export function isSingleFaceCard(obj: unknown): obj is SingleFaceCard {
    const typedObj = obj as SingleFaceCard
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        typeof typedObj["name"] === "string" &&
        typeof typedObj["id"] === "string" &&
        typeof typedObj["layout"] === "string" &&
        typeof typedObj["illustration_id"] === "string" &&
        isScryfallImageUris(typedObj["image_uris"]) as boolean
    )
}

export function isMultiFaceCard(obj: unknown): obj is MultiFaceCard {
    const typedObj = obj as MultiFaceCard
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        typeof typedObj["name"] === "string" &&
        typeof typedObj["id"] === "string" &&
        (typedObj["layout"] === "split" ||
            typedObj["layout"] === "flip" ||
            typedObj["layout"] === "transform" ||
            typedObj["layout"] === "modal_dfc" ||
            typedObj["layout"] === "meld" ||
            typedObj["layout"] === "battle" ||
            typedObj["layout"] === "double_faced_token") &&
        (typeof typedObj["image_uris"] === "undefined" ||
            isScryfallImageUris(typedObj["image_uris"]) as boolean) &&
        Array.isArray(typedObj["card_faces"]) &&
        isCardFace(typedObj["card_faces"][0]) as boolean &&
        isCardFace(typedObj["card_faces"][1]) as boolean
    )
}

export function isCardFace(obj: unknown): obj is CardFace {
    const typedObj = obj as CardFace
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        (typeof typedObj["image_uris"] === "undefined" ||
            isScryfallImageUris(typedObj["image_uris"]) as boolean) &&
        typeof typedObj["name"] === "string" &&
        (typeof typedObj["illustration_id"] === "undefined" ||
            typeof typedObj["illustration_id"] === "string")
    )
}

export function isCardImage(obj: unknown): obj is CardImage {
    const typedObj = obj as CardImage
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        typeof typedObj["name"] === "string" &&
        typeof typedObj["illustrationId"] === "string" &&
        typeof typedObj["imageUrl"] === "string" &&
        (typeof typedObj["available"] === "undefined" ||
            typedObj["available"] === false ||
            typedObj["available"] === true) &&
        (typeof typedObj["hasOtherFace"] === "undefined" ||
            typedObj["hasOtherFace"] === false ||
            typedObj["hasOtherFace"] === true)
    )
}

export function isArtState(obj: unknown): obj is ArtState {
    const typedObj = obj as ArtState
    return (
        (typedObj === "UNAVAILABLE" ||
            typedObj === "PENDING" ||
            typedObj === "AVAILABLE")
    )
}
