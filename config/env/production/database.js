module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections: {
    default: {
      connector: "mongoose",
      settings: {
        uri: env("DATABASE_URI_PROD"),
      },
      options: {
        ssl: true,
      },
    },
  },
});
