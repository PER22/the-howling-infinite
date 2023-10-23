const {
        getSignedUrl
      } = require("@aws-sdk/s3-request-presigner"),
      {
        Upload
      } = require("@aws-sdk/lib-storage"),
      {
        GetObjectCommand,
        PutObjectCommand,
        S3
      } = require("@aws-sdk/client-s3");
const multer = require('multer');
const multerS3 = require('multer-s3');


const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION
});

async function generatePresignedS3DownloadURL(objectKey){
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: objectKey,
    expiresIn: 1200
  }
  return await getSignedUrl(s3, new GetObjectCommand(params));
}

async function generatePresignedS3UploadURL(objectKey) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: objectKey,
    expiresIn: 3600
  };

  return await getSignedUrl(s3, new PutObjectCommand(params));
}

const sanitizeTitleForS3 = (title) => {
  return title.replace(/[^a-zA-Z0-9-_]/g, '-')
      .replace(/\s+/g, '-')
      .toLowerCase();
};

function extractKeyFromURL(url) {
  const urlParts = url.split('/');
  return urlParts.slice(3).join('/');
}

const uploadFiles = multer({
  storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_BUCKET_NAME,
      metadata: function (req, file, cb) {
          cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        let folder = '';
        if (file.fieldname === 'pdf') {
          folder = 'pdfs';
        } else if (file.fieldname === 'coverPhoto' || file.fieldname === 'image') {
          folder = 'coverimages';
          console.log("MulterS3: found a coverPhoto");
        }
        else if (file.fieldname === 'html') {
          folder = 'html';
        }
        else if (file.fieldname === 'folderFiles') {
          folder = 'essayimages';
        }
        console.log("uploadFiles(): req.entity._id.toString():", req.entity._id.toString());
        const entityId = req.entity._id.toString();
        cb(null, `${folder}-${entityId}-${sanitizeTitleForS3(file.originalname)}`);
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
    }).done(); 
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
  console.log("donwloadFromS3's key: ", key);
  const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key
  };

  return new Promise((outerResolve, outerReject) => {
      s3.getObject(params, (err, data) => {
          if (err) return outerReject(err);

          const incomingMsg = data.Body;
          let aggregatedData = '';
          
          incomingMsg.on('data', chunk => {
              aggregatedData += chunk;
          });

          incomingMsg.on('end', () => {
              outerResolve(aggregatedData);
          });

          incomingMsg.on('error', error => {
              outerReject(error);
          });
      });
  });
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
  uploadFiles,
  uploadToS3,
  downloadFromS3,
  deleteFromS3,
  generatePresignedS3DownloadURL, 
  generatePresignedS3UploadURL,
  updateInS3,
  sanitizeTitleForS3
};