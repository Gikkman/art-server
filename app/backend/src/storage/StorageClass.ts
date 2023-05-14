export type StorageClass = {
  store: (image: any, scryfallIllustrationId: string) => Promise<boolean>;
  promote: (scryfallIllustrationId: string) => Promise<boolean>;
  delete: (scryfallIllustrationId: string) => Promise<void>;
  list: (query: string) => Promise<string[]>;
  getAddress: () => Promise<string>;
};
