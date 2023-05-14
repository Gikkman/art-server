import { drive_v3, google } from "googleapis";
import path from "path";
import { DATA_DIR } from "../const";

const folderId = "17DcijzRQVK4l1Lh-ssAYpNrKzFBIW0GM";

export const getDriveService = () => {
  const KEYFILEPATH = path.join(DATA_DIR, "token.json");
  const SCOPES = ["https://www.googleapis.com/auth/drive"];

  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
  });
  const driveService = google.drive({ version: "v3", auth });
  return driveService;
};

export const uploadSingleFile = async (fileName: string) => {
  const response = await getDriveService().files.create({
    fields: "id,name",
    media: {
      mimeType: "text/plain",
      body: "Hello World",
    },
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
  });
  console.log("File Uploaded", response.data.name, response.data.id);
};

export async function list() {
  const files: drive_v3.Schema$File[] = [];
  const response = await getDriveService().files.list({
    q: `trashed = false`,
    fields: "nextPageToken, files(name, mimeType, id, kind, parents, trashed)",
    spaces: "drive",
  });
  if (response.data.files) {
    files.push(...response.data.files);
  }
  if (response.data.nextPageToken) {
    nextPage(response.data.nextPageToken, files);
  }
  transform(files);
}

async function nextPage(nextPageToken: string, accumulator: drive_v3.Schema$File[]) {
  const response = await getDriveService().files.list({
    pageToken: nextPageToken,
  });
  if (response.data.files) {
    accumulator.push(...response.data.files);
  }
  if (response.data.nextPageToken) {
    nextPage(response.data.nextPageToken, accumulator);
  }
}

function transform(data: drive_v3.Schema$File[]) {
  for (const d of data) {
    const f = { ...d, dl: `https://drive.google.com/uc?id=${d.id}&export=download` };
    console.log(f);
  }
}

list().catch((ex) => {
  console.error("ERROR");
  console.error(ex);
});
