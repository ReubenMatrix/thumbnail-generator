"use server";

import { currentUser } from "@clerk/nextjs/server";
import AWS from "aws-sdk";
import { format } from "date-fns";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const presignedUrl = async () => {

  const user = await currentUser();
  if (!user) {
    throw new Error("User not found");
  }


  const timeStamp = format(new Date(), "yyyyMMddHHmmss");
  const key = `${user.id}/${timeStamp}.png`;


  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Expires: 60, 
    ContentType: "image/png",
  };


  try {
    const uploadURL = s3.getSignedUrl("putObject", params);
    return uploadURL;
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    throw new Error("Could not generate pre-signed URL");
  }
};
