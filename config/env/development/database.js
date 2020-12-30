// module.exports = ({ env }) => ({
//   defaultConnection: "default",
//   connections: {
//     default: {
//       connector: "mongoose",
//       settings: {
//         uri: env("DATABASE_URI"),
//         // database: env("DATABASE_NAME"),
//       },
//       options: {
//         ssl: true,
//       },
//     },
//   },
// });

module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections: {
    default: {
      connector: "mongoose",
      settings: {
        host: env("DATABASE_HOST", "127.0.0.1"),
        srv: env.bool("DATABASE_SRV", false),
        port: env.int("DATABASE_PORT", 27017),
        database: env("DATABASE_NAME", "umami-production"),
        username: env("DATABASE_USERNAME", null),
        password: env("DATABASE_PASSWORD", null),
      },
      options: {
        authenticationDatabase: env("AUTHENTICATION_DATABASE", null),
        ssl: env.bool("DATABASE_SSL", false),
      },
    },
  },
});
