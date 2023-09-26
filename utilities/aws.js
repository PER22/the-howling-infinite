const {
        getSignedUrl
      } = require("@aws-sdk/s3-request-presigner"),
      {
        Upload
      } = require("@aws-sdk/lib-storage"),
      {
        GetObjectCommand,
        S3
      } = require("@aws-sdk/client-s3");
const multer = require('multer');
const multerS3 = require('multer-s3');


const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION
});

async function generateSignedURL(objectKey){
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: objectKey,
    Expires: 60 * 20
  }
  return await getSignedUrl(s3, new GetObjectCommand(params), {
    expiresIn: params.Expires
  });
}

function extractKeyFromURL(url) {
  const urlParts = url.split('/');
  return urlParts.slice(3).join('/');
}

const uploadImage = multer({
  storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_BUCKET_NAME,
      metadata: function (req, file, cb) {
          cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
  })
});

async function uploadToS3(key, content) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: content
  };
  try {
    const response = await new Upload({
      client: s3,
      params
    }).done();  // Using the .promise() method to get a promise
    return extractKeyFromURL(response.Location);
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;  // Rethrow the error so you can handle it in the calling function
  }
}

async function updateInS3(key, content) {
  const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: content
  };
  return new Promise((resolve, reject) => {
      s3.putObject(params, (err, data) => {
          if (err) {
              console.error('Error updating object in S3:', err);
              reject(err);
          } else {
              resolve(data);
          }
      });
  });
}

async function downloadFromS3(key) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key
  };
  try{
    return new Promise((resolve, reject) => {
      s3.getObject(params, (err, data) => {
        if (err) reject(err);
        resolve(data.Body);
      });
    });
  }catch(error){
    console.log("Error: ", error);
  }
}

async function deleteFromS3(key) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key
  };

  return new Promise((resolve, reject) => {
    s3.deleteObject(params, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

module.exports = {
  uploadImage,
  uploadToS3,
  downloadFromS3,
  deleteFromS3,
  generateSignedURL, 
  updateInS3
};