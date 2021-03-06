module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  admin: {
    auth: {
      secret: env("ADMIN_JWT_SECRET", "e8ff7c59e61c564e87147b51b5a9c062"),
    },
  },
  cron: {
    enabled: true,
  },
});
