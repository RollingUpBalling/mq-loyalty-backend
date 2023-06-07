export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    secretKey: process.env.GOOGLE_SECRET_KEY,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  near: {
    net: process.env.MAIN_NEAR_NET,
    accountId: process.env.MAIN_NEAR_ACCOUNT_ID,
    privateKey: process.env.MAIN_NEAR_PRIVATE_KEY,
  },
  s3: {
    spaceAccessKey: process.env.SPACES_ACCESS_KEY,
    spacePrivateKey: process.env.SPACES_PRIVATE_KEY,
    bucket: process.env.BUCKET_NAME,
  },
});
