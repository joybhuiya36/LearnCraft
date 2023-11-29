const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

const uploadFile = async (file, folder) => {
  const s3Client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  const param = {
    Bucket: process.env.S3_BUCKET,
    Key: folder
      ? `${folder}/${Date.now() + file.originalname}`
      : Date.now() + file.originalname,
    Body: file.buffer,
  };
  const uploader = new Upload({
    client: s3Client,
    params: param,
  });

  await uploader
    .done()
    .then(() => {
      console.log("File Uploaded Successfully!");
    })
    .catch((err) => {
      console.error("Failed to Upload the File:", err);
    });
  return process.env.S3_BASEURL + param.Key;
};
const deleteFile = async (url) => {
  const ob = url.split("/");
  let link = ob[3];
  for (let i = 4; i < ob.length; i++) link = link + "/" + ob[i];
  const s3Client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  const param = {
    Bucket: process.env.S3_BUCKET,
    Key: link,
  };
  await s3Client.send(new DeleteObjectCommand(param));
};
module.exports = { uploadFile, deleteFile };
