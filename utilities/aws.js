const AWS = require('aws-sdk');

const s3 = new AWS.S3(
    {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    }
);

function uploadToS3(key, content) {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: content,
        ACL: 'public-read'  // This will make the file publicly readable
    };
  
    return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
            if (err) reject(err);
            resolve(data.Location);  // This will give you the file URL after upload
      });
    });
  }
  
function downloadFromS3(key) {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
    };
  
    return new Promise((resolve, reject) => {
        s3.getObject(params, (err, data) => {
            if (err) reject(err);
            resolve(data.Body); // This will give you the file content
        });
    });
}

function deleteFromS3(key) {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key
    };
  
    return new Promise((resolve, reject) => {
      s3.deleteObject(params, (err, data) => {
        if (err) reject(err);
        resolve(data); // This will give you a response indicating the deletion
      });
    });
  }
  
  module.exports = {
    uploadToS3,
    downloadFromS3,
    deleteFromS3
  };