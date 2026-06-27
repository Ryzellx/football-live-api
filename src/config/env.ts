export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  sofascoreBaseUrl: 'https://www.thesportsdb.com/api/v1/json/3',
  requestTimeout: 15000,
  maxRetries: 3,
  sourceName: 'thesportsdb',
};
