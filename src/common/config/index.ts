export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  aws: {
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_SCCESS_KEY
  }
});
