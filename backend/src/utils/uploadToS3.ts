import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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

export const uploadToS3 = async (filePath: string, fileType: string) => {
  console.log(filePath);
  const fileStream = fs.createReadStream(filePath);

  const key = `media/${Date.now()}_${path.basename(filePath)}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: fileStream,
    ContentType: fileType,
    ACL: "private", // Keep the file private
  });

  await s3Client.send(command);

  // Return the public S3 URL
  return `${process.env.CLOUDFRONT_NAME}/${key}`;
};
