export type ProgramConfig = {
  storage: {
    fileSystem?: {
      storageClass: "FileSystem";
      acceptedPath: string;
      pendingPath: string;
    };
    s3?: {
      storageClass: "S3";
      bucketName: string;
      endpointUrl: string;
      accessKey: string;
      secretKey: string;
      acceptedPrefix: string;
      pendingPrefix: string;
    };
    googleDrive?: {
      googleKey: string;
    };
  };
};
