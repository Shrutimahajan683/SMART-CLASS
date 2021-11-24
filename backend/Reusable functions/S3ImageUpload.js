require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

exports.imageUpload = async (base64) => {
  const AWS = require("aws-sdk");
  AWS.config.setPromisesDependency(require("bluebird"));
  AWS.config.update({
    accessKeyId: process.env.AWSACCESSKEY,
    secretAccessKey: process.env.AWSSECRETKEY,
    region: process.env.REGION,
  });

  const s3 = new AWS.S3();
  const base64Data = new Buffer.from(
    base64.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const type = base64.split(";")[0].split("/")[1];
  console.log(type);
  const userId = uuidv4();
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${userId}.${type}`, // type is not required
    Body: base64Data,
    ACL: "public-read",
    ContentEncoding: "base64",
    ContentType: `image/${type}`,
  };
  let location = "";
  let key = "";
  try {
    const { Location, Key } = await s3.upload(params).promise();
    location = Location;
    key = Key;
  } catch (error) {
    console.log(error);
  }
  return location;
};
