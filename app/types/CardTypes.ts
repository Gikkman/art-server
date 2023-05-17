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
  releaseDate: string;
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

export const FRONT_BACK_LAYOUT = ["transform", "modal_dfc", "double_faced_token"] as const;
export const SPLIT_LAYOUT = ["aftermath", "split"] as const;
export const DOUBLE_FRONT_LAYOUT = ["meld"] as const;

export function isIn<T>(values: readonly T[], key: T) {
  return values.includes(key);
}
