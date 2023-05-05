export type Card = {
  name: string;
  collectorNumber: string;
  setCode: string;
  scryfallId: string;
  scryfallIllustrationId: string;
};

export type ScryfallCard = {
  name: string;
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
  layout: string;
  illustration_id: string;
  image_uris: ScryfallImageUris;
};

export type MultiFaceCard = {
  name: string;
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
};

export const TWO_FACED_LAYOUT = [
  "split",
  "flip",
  "transform",
  "modal_dfc",
  "meld",
  "battle",
  "double_faced_token",
] as const;
type TwoFacedLayoutTuple = typeof TWO_FACED_LAYOUT;
type TwoFacedLayout = TwoFacedLayoutTuple[number];

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
