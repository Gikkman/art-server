/*
 * Generated type guards for "ProgramConfig.ts".
 * WARNING: Do not manually change this file.
 */
import { ProgramConfig } from "./ProgramConfig";

export function isProgramConfig(obj: unknown): obj is ProgramConfig {
    const typedObj = obj as ProgramConfig
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        (typedObj["storage"] !== null &&
            typeof typedObj["storage"] === "object" ||
            typeof typedObj["storage"] === "function") &&
        (typeof typedObj["storage"]["fileSystem"] === "undefined" ||
            (typedObj["storage"]["fileSystem"] !== null &&
                typeof typedObj["storage"]["fileSystem"] === "object" ||
                typeof typedObj["storage"]["fileSystem"] === "function") &&
            typedObj["storage"]["fileSystem"]["storageClass"] === "FileSystem" &&
            typeof typedObj["storage"]["fileSystem"]["acceptedPath"] === "string" &&
            typeof typedObj["storage"]["fileSystem"]["pendingPath"] === "string") &&
        (typeof typedObj["storage"]["s3"] === "undefined" ||
            (typedObj["storage"]["s3"] !== null &&
                typeof typedObj["storage"]["s3"] === "object" ||
                typeof typedObj["storage"]["s3"] === "function") &&
            typedObj["storage"]["s3"]["storageClass"] === "S3" &&
            typeof typedObj["storage"]["s3"]["bucketName"] === "string" &&
            typeof typedObj["storage"]["s3"]["endpointUrl"] === "string" &&
            typeof typedObj["storage"]["s3"]["accessKey"] === "string" &&
            typeof typedObj["storage"]["s3"]["secretKey"] === "string" &&
            typeof typedObj["storage"]["s3"]["acceptedPrefix"] === "string" &&
            typeof typedObj["storage"]["s3"]["pendingPrefix"] === "string") &&
        (typeof typedObj["storage"]["googleDrive"] === "undefined" ||
            (typedObj["storage"]["googleDrive"] !== null &&
                typeof typedObj["storage"]["googleDrive"] === "object" ||
                typeof typedObj["storage"]["googleDrive"] === "function") &&
            typeof typedObj["storage"]["googleDrive"]["googleKey"] === "string")
    )
}
