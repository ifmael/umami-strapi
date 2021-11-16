module.exports = ({ env }) => ({
  upload: {
    provider: "aws-s3",
    providerOptions: {
      accessKeyId: env("AWS_ACCESS_KEY_ID_UMAMI"),
      secretAccessKey: env("AWS_ACCESS_SECRET_UMAMI"),
      region: "eu-west-1",
      params: {
        Bucket: "umami-images",
      },
    },
  },
});
