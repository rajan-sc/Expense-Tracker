const AWS = require("aws-sdk");

const uploadToS3 = async (data, filename) => {
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: "public-read"
    };

    return new Promise((resolve, reject) => {
        s3.upload(params, (err, s3response) => {
            if (err) {
                console.log(err);
                reject(new Error("Failed to upload to S3"));
            } else {
                console.log(s3response.Location);
                resolve(s3response.Location);
            }
        });
    });
}

module.exports = { uploadToS3 };
