import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

// Configure AWS S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadToS3Video = async (filePath: string, fileType: string) => {
  const fileStream = fs.createReadStream(filePath);
  const fileSize = fs.statSync(filePath).size;

  const key = `media/${Date.now()}_${path.basename(filePath)}`;
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  // Start multipart upload
  const createCommand = new CreateMultipartUploadCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: fileType,
    ACL: "private",
  });
  const { UploadId } = await s3Client.send(createCommand);

  const partSize = 5 * 1024 * 1024; // 5 MB per part
  const parts = [];
  let partNumber = 1;

  for await (const chunk of fileStream) {
    const uploadPartCommand = new UploadPartCommand({
      Bucket: bucketName,
      Key: key,
      UploadId,
      PartNumber: partNumber,
      Body: chunk,
    });

    const { ETag } = await s3Client.send(uploadPartCommand);
    parts.push({ ETag, PartNumber: partNumber });
    partNumber++;
  }

  // Complete multipart upload
  const completeCommand = new CompleteMultipartUploadCommand({
    Bucket: bucketName,
    Key: key,
    UploadId,
    MultipartUpload: { Parts: parts },
  });

  await s3Client.send(completeCommand);

  return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};
