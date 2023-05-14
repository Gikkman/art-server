import { join } from "path";
import { copyFile, rm, stat } from "fs/promises";
import { updateArtAvailability } from "../local-database";
import { StorageClass } from "./StorageClass";

export class FileSystemStorageClass implements StorageClass {
  private pendingPath: string;
  private acceptedPath: string;

  constructor(options: { pendingPath: string; acceptedPath: string }) {
    this.pendingPath = options.pendingPath;
    this.acceptedPath = options.acceptedPath;
  }

  async store(image: any, scryfallIllustrationId: string) {
    const savePath = join(this.pendingPath, scryfallIllustrationId);
    const savePathStat = stat(savePath);
    if (savePathStat !== undefined) return false;

    image.write(savePath);
    updateArtAvailability(scryfallIllustrationId, "PENDING");
    return true;
  }

  async promote(scryfallIllustrationId: string) {
    const imagePendingPath = join(this.pendingPath, scryfallIllustrationId);
    const pendingStat = await stat(imagePendingPath);
    if (pendingStat !== undefined) return false;

    const imageAcceptedPath = join(this.acceptedPath, scryfallIllustrationId);
    await copyFile(imagePendingPath, imageAcceptedPath);
    await rm(imagePendingPath);

    updateArtAvailability(scryfallIllustrationId, "AVAILABLE");
    return true;
  }

  async delete(scryfallIllustrationId: string) {
    scryfallIllustrationId.charAt(1);
    return;
  }
  async list(query: string) {
    return [query];
  }
  async getAddress() {
    return "";
  }
}
