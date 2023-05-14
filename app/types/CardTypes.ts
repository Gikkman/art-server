export type Card = {
  name: string;
  setCode: string;
  collectorNumber: string;
  scryfallId: string;
  scryfallIllustrationId: string;
  faceName?: string;
  layout?: string;
  side?: "a" | "b" | undefined;
  uuid: string;
  otherFaceIds?: string;
};

export type ScryfallCard = {
  name: string;
  id: string;
  illustration_id?: string;
  image_uris?: {
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
  };
  card_faces?: CardFace[];
  layout: string;
};

export type ScryfallImageUris = {
  normal: string;
  large: string;
  png: string;
  art_crop: string;
  border_crop: string;
};

export type SingleFaceCard = {
  name: string;
  id: string;
  layout: string;
  illustration_id: string;
  image_uris: ScryfallImageUris;
};

export type MultiFaceCard = {
  name: string;
  id: string;
  layout: TwoFacedLayout;
  image_uris?: ScryfallImageUris;
  card_faces: [CardFace, CardFace];
};

export type CardFace = {
  image_uris?: ScryfallImageUris;
  name: string;
  illustration_id?: string;
};

export type CardImage = {
  name: string;
  illustrationId: string;
  imageUrl: string;
  available?: boolean;
  hasOtherFace?: boolean;
};

export const ART_STATE = ["UNAVAILABLE", "PENDING", "AVAILABLE"] as const;
export const ART_STATE_MAPPING = {
  UNAVAILABLE: 10,
  PENDING: 20,
  AVAILABLE: 30,
} as const satisfies Record<ArtState, number>;
export type ArtState = (typeof ART_STATE)[number];
export function toArtState(s?: string): ArtState {
  if (!s) return "UNAVAILABLE";
  if (ART_STATE.includes(s as ArtState)) {
    return s as ArtState;
  }
  return "UNAVAILABLE";
}

export const TWO_FACED_LAYOUT = [
  "split",
  "flip",
  "transform",
  "modal_dfc",
  "meld",
  "battle",
  "double_faced_token",
] as const;
type TwoFacedLayout = (typeof TWO_FACED_LAYOUT)[number];

export function isTwoFaced(card: ScryfallCard): card is MultiFaceCard {
  return (
    card.card_faces !== undefined &&
    card.card_faces.length > 1 &&
    TWO_FACED_LAYOUT.includes(card.layout as TwoFacedLayout)
  );
}

export function isSingleFaced(card: ScryfallCard): card is SingleFaceCard {
  return card.card_faces === undefined && !TWO_FACED_LAYOUT.includes(card.layout as TwoFacedLayout);
}
