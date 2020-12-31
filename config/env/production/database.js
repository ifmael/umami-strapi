module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections: {
    default: {
      connector: "mongoose",
      settings: {
        uri: env("DATABASE_URI_DEV"),
      },
      options: {
        ssl: true,
      },
    },
  },
});
